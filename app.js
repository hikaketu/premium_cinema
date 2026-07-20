// =============================
// Premium Cinema App
// =============================

// APIキー
const API_KEY = "TuGXdS7cAwmFNxA0ntWELmFQr2Dok5Xn";

// 地域（東京）
const AREA = "130";

// NHK BS
const SERVICE = "s1";

// API URL
const API_URL = "https://program-api.nhk.jp/v3/papiPgDateTv";

// 今日の日付
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

const DATE = `${yyyy}-${mm}-${dd}`;

// =============================
// API取得
// =============================

async function loadPrograms() {

    const url =
        `${API_URL}?service=${SERVICE}&area=${AREA}&date=${DATE}&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API Error");
        }

        const json = await response.json();

        if (!json.s1 || !json.s1.publication) {

            document.getElementById("programList").innerHTML =
                "<p>番組情報がありません。</p>";

            return;

        }

        const programs = json.s1.publication;

        showPremiumCinema(programs);

    } catch (err) {

        console.error(err);

        document.getElementById("programList").innerHTML =
            "<p>取得に失敗しました。</p>";

    }

}

// =============================
// プレミアムシネマ抽出
// =============================

function showPremiumCinema(programs) {

    const movies = programs.filter(program => {

        const title = program.name || "";
        const series =
            program.about?.partOfSeries?.name || "";

        return (
            title.includes("プレミアムシネマ") ||
            series.includes("プレミアムシネマ")
        );

    });

    if (movies.length === 0) {

        document.getElementById("programList").innerHTML =
            "<p>本日のプレミアムシネマはありません。</p>";

        return;

    }

// ヒーロー
createHero(movies[0]);

// 一覧
createProgramList(movies);

// カレンダー
createCalendar(movies);

}

// =============================
// ヒーロー表示
// =============================

function createHero(program) {

    const heroTitle =
        document.getElementById("heroTitle");

    const heroDate =
        document.getElementById("heroDate");

    const heroDescription =
        document.getElementById("heroDescription");

    const heroImage =
        document.getElementById("heroImage");

    const nhkLink =
        document.getElementById("nhkLink");

    heroTitle.textContent = program.name;

    heroDate.textContent =
        formatDate(program.startDate);

    heroDescription.textContent =
        program.description || "";

    // 画像
    if (program.about &&
        program.about.eyecatch &&
        program.about.eyecatch.main) {

        heroImage.src =
            program.about.eyecatch.main.url;

    } else {

        heroImage.src = "noimage.png";

    }

    // NHKページ
    if (program.about &&
        program.about.canonical) {

        nhkLink.href =
            program.about.canonical;

    } else {

        nhkLink.href = "#";

    }

}

// =============================
// 日付変換
// =============================

function formatDate(dateString){

    const d = new Date(dateString);

    return d.toLocaleString("ja-JP",{

        year:"numeric",

        month:"2-digit",

        day:"2-digit",

        hour:"2-digit",

        minute:"2-digit"

    });

        }
// =============================
// 番組一覧表示
// =============================

function createProgramList(programs) {

    const list = document.getElementById("programList");

    list.innerHTML = "";

    programs.forEach(program => {

        const card = document.createElement("div");
        card.className = "card";

        const image =
            program.about?.eyecatch?.medium?.url ||
            program.about?.eyecatch?.small?.url ||
            "noimage.png";

        const link =
            program.about?.canonical || "#";

        card.innerHTML = `
            <img src="${image}" alt="${program.name}">

            <div class="card-body">

                <div class="card-title">
                    ${program.name}
                </div>

                <div class="card-date">
                    ${formatDate(program.startDate)}
                    ～
                    ${formatDate(program.endDate)}
                </div>

                <div class="card-description">
                    ${program.description || ""}
                </div>

                <br>

                <a class="button"
                   href="${link}"
                   target="_blank"
                   rel="noopener noreferrer">

                    NHKで見る

                </a>

            </div>
        `;

        list.appendChild(card);

    });

}

// =============================
// 自動更新
// =============================

// 初回読込
loadPrograms();

// 15分ごとに更新
setInterval(loadPrograms, 1000 * 60 * 15);

// =============================
// ページ読込演出
// =============================

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

// =============================
// エラー画像
// =============================

document.addEventListener("error", function(e){

    if(e.target.tagName === "IMG"){

        e.target.src = "noimage.png";

    }

}, true);

// =============================
// スムーズスクロール
// =============================

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        const href=this.getAttribute("href");

        if(href==="#") return;

        e.preventDefault();

        document.querySelector(href).scrollIntoView({

            behavior:"smooth"

        });

    });

});

// =============================
// デバッグ
// =============================

console.log("Premium Cinema App Loaded");
