// app scripting

let allEvents = [];
let bookmarkedKeys = new Set();

function saveBookmarks() {
    localStorage.setItem("cefBookmarks", JSON.stringify(Array.from(bookmarkedKeys)));
}

function loadBookmarks() {
    const raw = localStorage.getItem("cefBookmarks");
    if (!raw) return;
    try {
        const arr = JSON.parse(raw);
        bookmarkedKeys = new Set(arr);
    } catch (e) {
        console.error("Failed to load bookmarks from storage", e);
    }
}

// -------------------- Bookmarks helpers --------------------

function getEventKey(event) {
    return `${event.title}|${event.date}|${event.time}`;
}

// Render events onto the main list
function renderEvents(events) {
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = ""; // Clear old content
    const resultsInfo = document.getElementById("resultsInfo");
    if (resultsInfo) {
        resultsInfo.textContent = `Showing ${events.length} event${events.length === 1 ? "" : "s"}`;
    }

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
            <button class="bookmark-btn">★</button>
            <h2 class="event-title">${event.title}</h2>
            <p class="event-date">${event.date} • ${event.time}</p>
            <p class="event-description">${event.description}</p>
            <p class="event-category">${event.category}</p>
        `;

        const bookmarkBtn = card.querySelector(".bookmark-btn");
        const key = getEventKey(event);

        if (bookmarkedKeys.has(key)) {
            bookmarkBtn.classList.add("saved");
        }

        // clicking the star toggles bookmark only
        bookmarkBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // do not open detail when clicking star
            toggleBookmark(event, bookmarkBtn);
        });

        // clicking the card opens the detail view
        card.addEventListener("click", () => {
            openEventDetail(event);
        });

        eventList.appendChild(card);
    });
}

function toggleBookmark(event, buttonEl) {
    const key = getEventKey(event);

    if (bookmarkedKeys.has(key)) {
        bookmarkedKeys.delete(key);
        if (buttonEl) buttonEl.classList.remove("saved");
    } else {
        bookmarkedKeys.add(key);
        if (buttonEl) buttonEl.classList.add("saved");
    }
    saveBookmarks();
    // If bookmarks page is visible, refresh it
    const bookmarksPage = document.getElementById("bookmarksPage");
    if (bookmarksPage && !bookmarksPage.hidden) {
        renderBookmarks();
    }
}

function renderBookmarks() {
    const list = document.getElementById("bookmarkedList");
    list.innerHTML = "";

    const events = allEvents.filter(e => bookmarkedKeys.has(getEventKey(e)));

    if (events.length === 0) {
        const p = document.createElement("p");
        p.textContent = "You have no bookmarked events yet.";
        p.style.textAlign = "center";
        p.style.color = "#777";
        p.style.padding = "1rem";
        list.appendChild(p);
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

        card.addEventListener("click", () => {
            openEventDetail(event);
        });

        list.appendChild(card);
    });
}

// -------------------- Detail view --------------------

function openEventDetail(event) {
    const detailSection = document.getElementById("eventDetail");
    const eventListSection = document.getElementById("eventList");
    const bookmarksSection = document.getElementById("bookmarksPage");

    document.querySelector(".detail-title").textContent = event.title;
    document.querySelector(".detail-date").textContent = `${event.date} • ${event.time}`;
    document.querySelector(".detail-description").textContent = event.description;
    document.querySelector(".detail-category").textContent = event.category;

    eventListSection.hidden = true;
    if (bookmarksSection) bookmarksSection.hidden = true;
    detailSection.hidden = false;
}

// Back button
document.getElementById("detailBackButton").addEventListener("click", () => {
    const detailSection = document.getElementById("eventDetail");
    const eventListSection = document.getElementById("eventList");

    detailSection.hidden = true;
    eventListSection.hidden = false;

    // Scroll back to top of event list for a clean reset
    eventListSection.scrollTop = 0;
});

// -------------------- Search --------------------

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("focus", () => {
        searchInput.classList.add("search-active");
    });

    searchInput.addEventListener("blur", () => {
        searchInput.classList.remove("search-active");
    });

    searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();

        const filteredEvents = allEvents.filter(event =>
            event.title.toLowerCase().includes(searchText) ||
            event.description.toLowerCase().includes(searchText) ||
            event.category.toLowerCase().includes(searchText)
        );

        renderEvents(filteredEvents);
    });
}


// -------------------- Page visibility helpers --------------------

function hideAllPages() {
    document.getElementById("eventList").hidden = true;
    document.getElementById("eventDetail").hidden = true;
    document.getElementById("bookmarksPage").hidden = true;
}
function scrollToTop() {
    const main = document.querySelector(".app-main");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
}

function showBookmarksPage() {
    hideAllPages();
    document.getElementById("bookmarksPage").hidden = false;
    renderBookmarks();
}
// Clear all bookmarks
document.getElementById("clearBookmarksBtn").addEventListener("click", () => {
    bookmarkedKeys.clear();
    saveBookmarks();
    renderBookmarks();
    renderEvents(allEvents);
});


// -------------------- Navigation --------------------

document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => {
        const target = button.getAttribute("data-target");
        console.log("Navigation clicked:", target);

        const eventListSection = document.getElementById("eventList");
        const bookmarksSection = document.getElementById("bookmarksPage");
        const searchInput = document.getElementById("searchInput");

        // active nav styling
        document.querySelectorAll(".nav-button").forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        hideAllPages();

        if (target === "home") {
            eventListSection.hidden = false;
            scrollToTop();
        } else if (target === "search") {
            eventListSection.hidden = false;
            scrollToTop();
            if (searchInput) searchInput.focus();

        } else if (target === "bookmarks") {
            bookmarksSection.hidden = false;
            renderBookmarks();
            scrollToTop();

        } else if (target === "add") {
            console.log("Add Event feature coming later.");
            eventListSection.hidden = false;
            scrollToTop();
        }
    });
});

// -------------------- Load events from JSON --------------------

fetch("data/events.json")
    .then(response => response.json())
    .then(events => {

        // Sort events by date automatically
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        allEvents = events;
        loadBookmarks();
        console.log("Events loaded:", allEvents);

        renderEvents(allEvents);
        setupSearch();
    })
    .catch(error => {
        console.error("Error loading events:", error);
    });

console.log("College Event Finder application has loaded sucessfully.");
// Ensure default view on load
hideAllPages();
function scrollToTop() {
    const main = document.querySelector(".app-main");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("eventList").hidden = false;
