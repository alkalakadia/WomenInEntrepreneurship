class Calendar {
    constructor(containerElement) {
        this.container = containerElement;
        this.startDate = new Date(2025, 7);
        this.date = new Date(2025, 7);
        this.events = [];
        this.render();
        this.attachNavigationListeners();
    }

    render() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const isPrevMonthDisabled =
            this.date.getFullYear() === this.startDate.getFullYear() &&
            this.date.getMonth() <= this.startDate.getMonth();

        this.container.innerHTML = `
            <div class="calendar-header">
                <button class="prev-month" ${isPrevMonthDisabled ? 'disabled' : ''}>←</button>
                <h2>${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button class="next-month">→</button>
            </div>
            <div class="calendar-grid">
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    .map(day => `<div class="calendar-day day-name">${day}</div>`).join('')}
                ${Array(firstDay.getDay()).fill().map(() => '<div class="calendar-day"></div>').join('')}
                ${Array(lastDay.getDate()).fill().map((_, i) => {
                    const day = i + 1;
                    const currentDate = new Date(year, month, day);
                    const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    const dayEvents = this.events.filter(event => event.date === isoDate);
                    const hasEvent = dayEvents.length > 0;
                    
                    return `<div class="calendar-day ${hasEvent ? 'has-event' : ''}" 
                                data-date="${isoDate}" 
                                data-has-events="${hasEvent}">${day}</div>`;
                }).join('')}
            </div>
            <div class="event-list"></div>
        `;

        this.attachDayClickHandlers();
    }

    attachNavigationListeners() {
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('prev-month')) {
                const newDate = new Date(this.date.getFullYear(), this.date.getMonth() - 1);
                if (newDate.getFullYear() > this.startDate.getFullYear() ||
                    (newDate.getFullYear() === this.startDate.getFullYear() &&
                     newDate.getMonth() >= this.startDate.getMonth())) {
                    this.date = newDate;
                    this.render();
                }
            }
            if (e.target.classList.contains('next-month')) {
                this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1);
                this.render();
            }
        });
    }

    attachDayClickHandlers() {
        const dayCells = this.container.querySelectorAll('.calendar-day[data-has-events="true"]');
        dayCells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                const date = cell.getAttribute('data-date');
                const dayEvents = this.events.filter(event => event.date === date);
                if (dayEvents.length > 0) {
                    this.showEvents(dayEvents);
                    
                    // Remove active class from all cells
                    this.container.querySelectorAll('.calendar-day').forEach(day => {
                        day.classList.remove('active');
                    });
                    // Add active class to clicked cell
                    cell.classList.add('active');
                }
            });
        });
    }

    addEvent(event) {
        this.events.push(event);
        this.render();
    }

    showEvents(events) {
        const eventList = this.container.querySelector('.event-list');
        eventList.innerHTML = events.map(event => {
            const eventDate = new Date(event.date);
            return `
                <div class="event-card">
                    <h3>${event.title}</h3>
                    <p><strong>Date:</strong> ${eventDate.toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p>${event.description}</p>
                </div>
            `;
        }).join('');
        
        // Scroll to event list with offset for better visibility
        const headerOffset = 80;
        const elementPosition = eventList.getBoundingClientRect().top;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        const calendar = new Calendar(calendarContainer);

        calendar.addEvent({
            title: "Founder's Panel",
            date: '2025-08-15',
            time: '2:00 PM - 4:00 PM',
            location: 'Business School',
            description: 'Join us for a panel of founders to discuss their journey and advice.'
        });

        calendar.addEvent({
            title: 'Networking Night',
            date: '2025-09-20',
            time: '6:00 PM - 8:00 PM',
            location: 'WID',
            description: 'Connect with successful women entrepreneurs and industry leaders.'
        });

        calendar.addEvent({
            title: 'Pitch Competition',
            date: '2025-10-10',
            time: '5:00 PM - 7:00 PM',
            location: 'Grainger Hall',
            description: 'Come pitch your idea to a panel of judges and win prizes!'
        });
    }
});
