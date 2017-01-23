var assert = require("assert");

var JSZip = require("jszip");

var test = require("./test")(module);
var zipfile = require("../lib/zipfile");

test('file in zip can be read after being written', function() {
    var zip = emptyZipFile();
    assert(!zip.exists("song/title"));
    
    zip.write("song/title", "Dark Blue");
    
    assert(zip.exists("song/title"));
    return zip.read("song/title", "utf8").then(function(contents) {
        assert.equal(contents, "Dark Blue");
    });
});

function emptyZipFile() {
    var zip = new JSZip();
    var buffer = zip.generate({type: "arraybuffer"});
    return zipfile.openArrayBuffer(buffer);
}

test("uriToZipEntryName", {
    "when path does not have leading slash then path is resolved relative to base": function() {
        assert.equal(
            zipfile.uriToZipEntryName("one/two", "three/four"),
            "one/two/three/four"
        )
    },

    "when path has leading slash then base is ignored": function() {
        assert.equal(
            zipfile.uriToZipEntryName("one/two", "/three/four"),
            "three/four"
        )
    }
});
