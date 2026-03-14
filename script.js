const API_KEY = "NTpfw1hW1MI5GOsjuwxrW"
const NKJV_ID = "de4e12af7f28f599-02"


function getVerse() {
    const verse = document.getElementById("verse").value;
    const translation = document.getElementById("translation-select").value;

    if (!verse) {
        document.getElementById("reference").textContent = "Please enter a verse";
        document.getElementById("text").textContent = "";
        document.getElementById("translation").textContent = "";
        return;
    }

    if (translation === "kjv" || translation === "web") {

    const url = `https://bible-api.com/${encodeURIComponent(verse)}?translation=${translation}`; 

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            document.getElementById("reference").textContent = "Verses not found.Please check your Input";
            document.getElementById("text").textContent = "";
            document.getElementById("translation").textContent = "";
        }
        console.log(data);

        document.getElementById("reference").textContent = data.reference;

        let versesText ="";
        data.verses.forEach(v => {
            versesText += `${v.verse}. ${v.text}\n\n`;
        });
        document.getElementById("text").textContent = versesText;
        document.getElementById("translation").textContent = "translation: King James Version (kjv)";
    })

    .catch((error) => {
        console.log("error:", error);
        document.getElementById("reference").textContent = "Something went wrong. Please try again";
        document.getElementById("text").textContent = "";
        document.getElementById("translation").textContent = "";
    });

} else if (translation === "nkjv") {
    const passageId = convertToPassageId(verse);
    
    if (!passageId) {
        document.getElementById("reference").textContent = "Format not recognised. Try e.g. John 3:16";
        document.getElementById("text").textContent = "";
        document.getElementById("translation").textContent = "";
        return;
    }

    const passageUrl = `https://api.scripture.api.bible/v1/bibles/${NKJV_ID}/passages/${passageId}?content-type=text&include-notes=false&include-titles=false`;

    fetch (passageUrl, {
        headers: {
            "api-key": API_KEY
        }
    })
    .then((response) => { 
        if (!response.ok) {
            throw new Error("Status" + response.status);
        }
        return response.json()
    })
    .then((data) => {
        if (!data.data) {
            document.getElementById("reference").textContent = "Verse not found.Please check your Input";
            document.getElementById("text").textContent = "";
            document.getElementById("translation").textContent = "";
            return;
        }
        const passage = data.data.passages[0];
        const cleanText = passage.content
            .replace (/<[^>]*>/g, " ")
            .replace (/\s+/g, " ")
            .trim ();
        
        document.getElementById("reference").textContent = data.data.reference;
        document.getElementById("text").textContent = cleanText;
        document.getElementById("translation").textContent = "translation: New King James Version (njkv)";
    })
    .catch((error) => {
        console.log("error:", error);
        document.getElementById("reference").textContent = "something went wrong. Please try again";
        document.getElementById("text").textContent = "";
        document.getElementById("translation").textContent = "";
    });

}

}

function convertToPassageId(verse) {
    const bookMap = {
        "genesis": "GEN", "exodus": "EXO", "leviticus": "LEV",
        "numbers": "NUM", "deuteronomy": "DEU", "joshua": "JOS",
        "judges": "JDG", "ruth": "RUT", "1 samuel": "1SA",
        "2 samuel": "2SA", "1 kings": "1KI", "2 kings": "2KI",
        "1 chronicles": "1CH", "2 chronicles": "2CH", "ezra": "EZR",
        "nehemiah": "NEH", "esther": "EST", "job": "JOB",
        "psalm": "PSA", "psalms": "PSA", "proverbs": "PRO",
        "ecclesiastes": "ECC", "isaiah": "ISA", "jeremiah": "JER",
        "lamentations": "LAM", "ezekiel": "EZK", "daniel": "DAN",
        "hosea": "HOS", "joel": "JOL", "amos": "AMO",
        "jonah": "JON", "micah": "MIC", "nahum": "NAH",
        "habakkuk": "HAB", "zephaniah": "ZEP", "haggai": "HAG",
        "zechariah": "ZEC", "malachi": "MAL", "matthew": "MAT",
        "mark": "MRK", "luke": "LUK", "john": "JHN",
        "acts": "ACT", "romans": "ROM", "1 corinthians": "1CO",
        "2 corinthians": "2CO", "galatians": "GAL", "ephesians": "EPH",
        "philippians": "PHP", "colossians": "COL", "1 thessalonians": "1TH",
        "2 thessalonians": "2TH", "1 timothy": "1TI", "2 timothy": "2TI",
        "titus": "TIT", "hebrews": "HEB", "james": "JAS",
        "1 peter": "1PE", "2 peter": "2PE", "1 john": "1JN",
        "2 john": "2JN", "3 john": "3JN", "jude": "JUD",
        "revelation": "REV"
    };

    const input = verse.toLowerCase().trim();
    const match = input.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);

    if (!match) return null;

    const bookName = match[1].trim();
    const chapter  = match[2];
    const verseNum = match[3];
    const bookCode = bookMap[bookName];

    if (!bookCode) return null;

    return verseNum ? `${bookCode}.${chapter}.${verseNum}` : `${bookCode}.${chapter}`;
}
