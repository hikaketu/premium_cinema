// =============================
// Premium Cinema Calendar
// =============================

const calendarArea = document.getElementById("calendarArea");

function createCalendar(programs){

    if(!calendarArea) return;

    calendarArea.innerHTML="";

    const table=document.createElement("table");

    table.className="calendar";

    table.innerHTML=`
    <thead>
        <tr>
            <th>日付</th>
            <th>作品</th>
            <th>放送時間</th>
        </tr>
    </thead>
    `;

    const tbody=document.createElement("tbody");

    programs.forEach(program=>{

        const tr=document.createElement("tr");

        const start=new Date(program.startDate);

        const date=start.toLocaleDateString("ja-JP",{
            month:"2-digit",
            day:"2-digit"
        });

        const time=start.toLocaleTimeString("ja-JP",{
            hour:"2-digit",
            minute:"2-digit"
        });

        const link=program.about?.canonical || "#";

        tr.innerHTML=`
        <td>${date}</td>

        <td>

            <a href="${link}"
               target="_blank"
               rel="noopener noreferrer">

               ${program.name}

            </a>

        </td>

        <td>${time}</td>
        `;

        tbody.appendChild(tr);

    });

    table.appendChild(tbody);

    calendarArea.appendChild(table);

}
