// app scripting

let allEvents = [];

// Render events onto the page
function renderEvents(events) {
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = ""; // Clear old content

    if (events.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No events found.";
        message.style.textAlign = "center";
        message.style.padding = "1rem";
        message.style.color = "#777";
        eventList.appendChild(message);
        return;
    }

    events.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("event-card");

        card.innerHTML = `
            <h2 class="event-title">${event.title}</h2>
            <p class="event-date">${event.date} • ${event.time}</p>
            <p class="event-description">${event.description}</p>
            <p class="event-category">${event.category}</p>
        `;

        // Clicking card open an actual event page
        card.addEventListener("click", () => {
            openEventDetail(event);
        });

        eventList.appendChild(card);
    });
}


    function openEventDetail(event) {
        const detailSection = document.getElementById("eventDetail");
        const eventListSection = document.getElementById("eventList");

        document.querySelector(".detail-title").textContent = event.title;
        document.querySelector(".detail-date").textContent = `${event.date} • ${event.time}`;
        document.querySelector(".detail-description").textContent = event.description;
        document.querySelector(".detail-category").textContent = event.category;

        // Show detail while hiding the list behind it
        eventListSection.hidden = true;
        detailSection.hidden = false;
    }




// Search Bar Conifgs
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        console.error("Search input not found");
        return;
    }

    searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();

        const filteredEvents = allEvents.filter(event =>    ///very specifically so that every word can be searchable
            event.title.toLowerCase().includes(searchText) ||
            event.description.toLowerCase().includes(searchText) ||
            event.category.toLowerCase().includes(searchText)
        );

        renderEvents(filteredEvents);
    });
}

// Loading events from JSON file
fetch("data/events.json")
    .then(response => response.json())
    .then(events => {

        // Sort events by date automatically
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        allEvents = events;
        console.log("Events loaded:", allEvents);

        renderEvents(allEvents);
        setupSearch();
    })
    .catch(error => {
        console.error("Error loading events:", error);
    });

// Back button
document.getElementById("detailBackButton").addEventListener("click", () => {
    const detailSection = document.getElementById("eventDetail");
    const eventListSection = document.getElementById("eventList");

    detailSection.hidden = true;
    eventListSection.hidden = false;

    // Scroll back to top of event list for a clean reset
    eventListSection.scrollTop = 0;
});

// Show bookmarks
function showBookmarksPage() {
    document.getElementById("eventList").hidden = true;
    document.getElementById("eventDetail").hidden = true;
    document.getElementById("bookmarksPage").hidden = false;
}
function hideAllPages() {
    document.getElementById("eventList").hidden = true;
    document.getElementById("eventDetail").hidden = true;
    document.getElementById("bookmarksPage").hidden = true;
}


// Navigation button
document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => {
        const target = button.getAttribute("data-target");
        console.log("Navigation clicked:", target);

        const eventListSection = document.getElementById("eventList");
        const detailSection = document.getElementById("eventDetail");
        const bookmarksSection = document.getElementById("bookmarksPage");
        const searchInput = document.getElementById("searchInput");

        if (target === "home") {
            hideAllPages();
            document.getElementById("eventList").hidden = true;

        } else if (target === "search") {
            hideAllPages();
            document.getElementById("searchInput").focus();
            document.getElementById("eventList").hidden = false;

        } else if (target === "bookmarks") {
            showBookmarksPage(); // UI-only for now
        } else if (target === "add") {
            // Placeholder for future "Add Event" page
            console.log("Add Event feature coming later.");
        }
        hideAllPages();
        document.getElementById("bookmarksPage").hidden = false;

    });
});


console.log("College Event Finder application has loaded sucessfully.");
