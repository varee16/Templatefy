const fs = require("fs");
const archiver = require("archiver");

module.exports = function generateZip(orderId, license, email) {
    const output = fs.createWriteStream(
        `downloads/Templatefy-${orderId}.zip`
    );
 const archive = archiver("zip");

 archive.pipe(output);

 archive.directory(`templates/${license}`, false);

 archive.append(
    `Order ID: ${orderId}
    License: ${license}
    Customer: ${email}
    @ 2026 Templatefy`,
    { name: "ORDER.txt"}
 );

 archive.file(`licenses/${license}.txt`, {
    name: "LICENSE.txt"
 });

 archive.finalize();
};