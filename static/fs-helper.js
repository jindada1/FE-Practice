/**
* Writes the contents to disk.
*
* @param {FileSystemFileHandle} fileHandle File handle to write to.
* @param {string} contents Contents to write.
*/
async function writeFile(fileHandle, contents) {
    // Support for Chrome 82 and earlier.
    if (fileHandle.createWriter) {
        // Create a writer (request permission if necessary).
        const writer = await fileHandle.createWriter();
        // Write the full length of the contents
        await writer.write(0, contents);
        // Close the file and write the contents to disk
        await writer.close();
        return;
    }
    // For Chrome 83 and later.
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}

/**
 * Open a handle to an existing file on the local file system.
 *
 * @return {!Promise<FileSystemFileHandle>} Handle to the existing file.
 */
function getFileHandle() {
    // For Chrome 86 and later...
    if ('showOpenFilePicker' in window) {
        return window.showOpenFilePicker().then((handles) => handles[0]);
    }
    // For Chrome 85 and earlier...
    return window.chooseFileSystemEntries();
}


async function openFileExplorer(params) {
    const fh = await getFileHandle()
    console.log(fh);
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fh.createWritable();
    // Write the contents of the file to the stream.
    await writable.write("contents");
    // Close the file and write the contents to disk.
    await writable.close();
}


async function openFolderExplorer(params) {
    const dirPicker = await window.showDirectoryPicker();
    console.log(dirPicker)
    const files = await listAllFilesAndDirs(dirPicker)
    console.log(files);
}

async function listAllFilesAndDirs(dirHandle) {
    const files = [];
    for await (let [name, handle] of dirHandle) {
        const { kind } = handle;
        if (handle.kind === 'directory') {
            files.push({ 
                name, handle, kind, 
                subs: await listAllFilesAndDirs(handle) 
            });
            // files.push(...await listAllFilesAndDirs(handle));
        } else {
            files.push({ name, handle, kind });
        }
    }
    return files;
}