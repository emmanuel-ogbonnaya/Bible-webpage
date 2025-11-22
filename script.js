function getVerse() {
    const verse = document.getElementById("verse").value;
    const url = `https://bible-api.com/${encodeURIComponent(verse)}`; 

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        document.getElementById("reference").textContent = data.reference;

        let versesText ="";
        data.verses.forEach(v => {
            versesText += `${v.verse}. ${v.text}\n\n`;
        });
        document.getElementById("text").textContent = versesText;
        document.getElementById("translation").textContent = data.translation;
    })

    .catch((error) => {
        console.log("error:", error);
    });

}