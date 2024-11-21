/*
Name: Wu Li
Date: 11/20/2024
File: script.js

Wu Li, UMass Lowell Computer Science, wuhui_li@student.uml.edu
Copyright (c) 2024 by Wu. All rights reserved. May be freely copied or 
excerpted for educational purposes with credit to the author.
*/

$(document).ready(function () {
    // Initialize the tabs
    $("#tabs").tabs();

    // Counter for unique tab IDs
    let tabCounter = 1;

    // Function to initialize sliders and bind them to inputs
    function bindSlider(inputId, sliderId, min, max) {
        const input = $(`#${inputId}`);
        const slider = $(`#${sliderId}`);

        // Initialize the slider
        slider.slider({
            min: min,
            max: max,
            value: parseInt(input.val(), 10) || 0,
            slide: function (event, ui) {
                input.val(ui.value); // Update input value on slide
                generateDynamicTable(); // Update table dynamically
            }
        });

        // Update slider value and table when input changes
        input.on("input change", function () {
            const value = parseInt($(this).val(), 10);
            if (!isNaN(value) && value >= min && value <= max) {
                slider.slider("value", value);
                generateDynamicTable(); // Update table dynamically
            }
        });
    }

    // Bind sliders to corresponding inputs
    bindSlider("min-column", "slider-min-column", -50, 50);
    bindSlider("max-column", "slider-max-column", -50, 50);
    bindSlider("min-row", "slider-min-row", -50, 50);
    bindSlider("max-row", "slider-max-row", -50, 50);

    // Function to update the main table dynamically
    function generateDynamicTable() {
        if (!$("#table-form").valid()) {
            return; // Do not proceed if the form is invalid
        }

        const hStart = parseInt($("#min-column").val());
        const hEnd = parseInt($("#max-column").val());
        const vStart = parseInt($("#min-row").val());
        const vEnd = parseInt($("#max-row").val());

        const table = $("#multiplication-table");
        table.empty();

        const thead = $("<thead>");
        const headerRow = $("<tr>");
        headerRow.append($("<th>")); // Top-left corner

        for (let h = hStart; h <= hEnd; h++) {
            headerRow.append($("<th>").text(h));
        }
        thead.append(headerRow);
        table.append(thead);

        const tbody = $("<tbody>");
        for (let v = vStart; v <= vEnd; v++) {
            const row = $("<tr>");
            row.append($("<th>").text(v)); // Row header
            for (let h = hStart; h <= hEnd; h++) {
                row.append($("<td>").text(h * v));
            }
            tbody.append(row);
        }
        table.append(tbody);
    }

    // Bind the Generate Table button to the table generation function
    $("#generate-table").on("click", function () {
        // Trigger validation and generate table if valid
        if ($("#table-form").valid()) {
            generateDynamicTable();
        }
    });

    // Add a new table to a tab
    $("#add-tab").on("click", function () {
        if ($("#table-form").valid()) {
            // Parse the input values as integers
            const hStart = parseInt($("#min-column").val(), 10);
            const hEnd = parseInt($("#max-column").val(), 10);
            const vStart = parseInt($("#min-row").val(), 10);
            const vEnd = parseInt($("#max-row").val(), 10);
    
            if (isNaN(hStart) || isNaN(hEnd) || isNaN(vStart) || isNaN(vEnd)) {
                alert("Invalid input values. Please ensure all inputs are numbers.");
                return;
            }
    
            // Create unique IDs for the new tab and its content
            const tabId = `tab-${tabCounter}`;
            const contentId = `tab-content-${tabCounter}`;
            tabCounter++;
    
            // Add the new tab header
            $("#tabs ul").append(`
                <li><a href="#${contentId}">${hStart}-${hEnd}, ${vStart}-${vEnd}</a>
                    <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span>
                </li>
            `);
    
            // Generate the table for the new tab
            const tableHTML = generateTableHTML(hStart, hEnd, vStart, vEnd);
    
            // Add the new tab content with the generated table
            $("#tabs").append(`
                <div id="${contentId}">
                    ${tableHTML}
                </div>
            `);
    
            // Refresh the tabs to reflect the changes
            $("#tabs").tabs("refresh");
    
            // Switch to the newly added tab
            $(`#tabs a[href="#${contentId}"]`).click();
        }
    });    

    // Close tabs dynamically when the close icon is clicked
    $("#tabs").on("click", ".ui-icon-close", function () {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $(`#${panelId}`).remove();
        $("#tabs").tabs("refresh");
    });

    function generateTableHTML(hStart, hEnd, vStart, vEnd) {
        let html = `
            <div class="scrollable-container">
                <table class="multiplication-table">
                    <thead>
                        <tr><th></th>`;
        
        for (let col = hStart; col <= hEnd; col++) {
            html += `<th>${col}</th>`;
        }
        html += `</tr>
                    </thead>
                    <tbody>`;
        
        for (let row = vStart; row <= vEnd; row++) {
            html += `<tr><th>${row}</th>`;
            for (let col = hStart; col <= hEnd; col++) {
                html += `<td>${row * col}</td>`;
            }
            html += `</tr>`;
        }
        html += `</tbody>
                </table>
            </div>`;
        
        return html;
    }      

    // Add validation rules to the form
    $("#table-form").validate({
        rules: {
            minColumn: { required: true, number: true, min: -50, max: 50 },
            maxColumn: { required: true, number: true, min: -50, max: 50, greaterThanOrEqual: "#min-column" },
            minRow: { required: true, number: true, min: -50, max: 50 },
            maxRow: { required: true, number: true, min: -50, max: 50, greaterThanOrEqual: "#min-row" }
        },
        messages: {
            minColumn: { required: "Enter a minimum column value.", min: "Minimum is -50.", max: "Maximum is 50." },
            maxColumn: { required: "Enter a maximum column value.", min: "Minimum is -50.", max: "Maximum is 50.", greaterThanOrEqual: "Must be >= Min Column." },
            minRow: { required: "Enter a minimum row value.", min: "Minimum is -50.", max: "Maximum is 50." },
            maxRow: { required: "Enter a maximum row value.", min: "Minimum is -50.", max: "Maximum is 50.", greaterThanOrEqual: "Must be >= Min Row." }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).addClass("input-error");
        },
        unhighlight: function (element) {
            $(element).removeClass("input-error");
        }
    });

    // Custom validation method to ensure a value is greater than or equal to another
    $.validator.addMethod("greaterThanOrEqual", function (value, element, param) {
        return parseFloat(value) >= parseFloat($(param).val());
    }, "Value must be greater than or equal to the related field.");

    $("#delete-all-tabs").on("click", function () {
        // Remove all tabs and their content
        $("#tabs ul").empty(); // Clear all tab headers
        $("#tabs div").remove(); // Remove all tab content

        // Refresh the tabs to reflect the changes
        $("#tabs").tabs("refresh");
    });
});

