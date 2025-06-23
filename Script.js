#target photoshop

function main() {
    // --- START OF USER SETTINGS ---

    // Set your desired MAXIMUM dimension in pixels. The script will ensure the longest
    // side of any image (width or height) is resized to this value,
    // while the other side scales down proportionally to prevent distortion.
    var maxDimension = 55; // px

    // --- END OF USER SETTINGS ---


    var sourceFolder = Folder.selectDialog("Select the folder with PNG files to convert");
    if (!sourceFolder) {
        return; // User cancelled
    }

    var fileList = sourceFolder.getFiles(/\.(png)$/i);

    if (fileList.length === 0) {
        alert("No PNG files were found in the selected folder.");
        return;
    }

    for (var i = 0; i < fileList.length; i++) {
        var doc = open(fileList[i]);
        var docName = doc.name.replace(/\.[^\.]+$/, '');

        // --- Smart Resizing Logic ---
        var originalWidth = doc.width.as('px');
        var originalHeight = doc.height.as('px');
        var newWidth, newHeight;

        if (originalWidth > originalHeight) { // Image is landscape
            newWidth = maxDimension;
            // Calculate new height based on original aspect ratio
            newHeight = originalHeight * (maxDimension / originalWidth);
        } else { // Image is portrait or square
            newHeight = maxDimension;
            // Calculate new width based on original aspect ratio
            newWidth = originalWidth * (maxDimension / originalHeight);
        }

        // Resize the image using the calculated, non-distorted dimensions
        doc.resizeImage(UnitValue(newWidth, 'px'), UnitValue(newHeight, 'px'), null, ResampleMethod.AUTOMATIC);

        // --- Define Brush ---
        app.activeDocument.selection.selectAll();
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putClass(charIDToTypeID("Brsh"));
        desc.putReference(charIDToTypeID("null"), ref);
        var ref1 = new ActionReference();
        ref1.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("fsel"));
        ref1.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("Usng"), ref1);
        desc.putString(charIDToTypeID("Nm  "), docName);
        executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);

        doc.close(SaveOptions.DONOTSAVECHANGES);
    }

    alert(fileList.length + " brushes created successfully at a max dimension of " + maxDimension + "px.");
}

main();