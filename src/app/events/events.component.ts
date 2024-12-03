import { Component, OnInit } from '@angular/core';
import { EventService, EventDTO } from '../event.service'; // Adjust the path if necessary
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  availableCategories: string[] = [];
  availableTags: { name: string; selected: boolean }[] = [
    { name: 'Technology', selected: false },
    { name: 'Sports', selected: false },
    { name: 'AI', selected: false },
    { name: 'Art & Culture', selected: false },
    { name: 'Music', selected: false },
    { name: 'Networking', selected: false },
    { name: 'Entrepreneurship', selected: false },
    { name: 'Gaming', selected: false },
    { name: 'Literature', selected: false },
    { name: 'Dance', selected: false },
    { name: 'Science', selected: false },
  ];
  events: EventDTO[] = [];
  filteredEvents: EventDTO[] = [];

  filters = {
    searchText: '',
    selectedTags: new Set<string>()
  };
  isModalOpen = false; 

  selectedEvent: EventDTO | null = null;
  subscribedEvents = new Set<number>();
  availableClubs: { id: number; name: string; selected: boolean }[] = [];

  // Add new methods

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.fetchEvents();
  }

 

fetchEvents() {
  this.eventService.getEvents().subscribe({
    next: (response) => {
      console.log('Fetched Events:', response);

      // Map the events and fetch club names for each club ID
      const eventList = (response.data || []).map((event: any): EventDTO => ({
        id: event.eventId,
        title: event.name,
        description: event.description,
        tags: event.tags || [],
        imageUrl: event.imageUrl || '',
        club: { id: event.clubId, name: '' }, // Placeholder for club name
        attendees: event.attendeeIds || [],
      }));

      // Prepare an array of observables to fetch club names
      const clubRequests: (Observable<any> | null)[] = eventList.map((event: EventDTO): Observable<any> | null => {
        if (event.club?.id) {
          return this.eventService.getClubbyID(event.club.id);
        }
        return null;
      });

      // Execute all requests in parallel using forkJoin
      forkJoin(clubRequests.filter(Boolean) as Observable<any>[]).subscribe({
        next: (clubResponses) => {
          // Update events with club names
          eventList.forEach((event: { club: { id: any; name: any; }; }, index: number) => {
            if (event.club?.id) {
              event.club.name = clubResponses[index]?.name || 'Unknown Club'; // Assign club name or fallback
            }
          });

          // Set updated events to the component's properties
          this.events = eventList;
          this.filteredEvents = [...this.events];
          console.log('Events with Club Names:', this.events);
        }, 
        error: (err) => console.error('Failed to fetch club names:', err),
      });
    },
    error: (err) => console.error('Failed to fetch events:', err),
  });
}


fetchAvailableClubs() {
  this.eventService.getClubs().subscribe({
    next: (clubResponse) => {
      console.log('Fetched Clubs:', clubResponse); // Log the fetched clubs to verify

      // Map clubs into availableClubs array
      this.availableClubs = (clubResponse || []).map((club: any) => ({
        id: club.clubId,    // Use clubId instead of id
        name: club.name,    // Name is already correct
        selected: false,    // Default selected to false
      }));

      console.log('Available Clubs:', this.availableClubs);
    },
    error: (err) => console.error('Failed to fetch clubs:', err),
  });
}

openModal() {
  this.isModalOpen = true;
  this.fetchAvailableClubs();
}

closeModal() {
  this.isModalOpen = false;
}

openEventModal(event: EventDTO) {
  this.selectedEvent = event;
}


isSubscribed(eventId: number): boolean {
  return this.subscribedEvents.has(eventId);
}
getSelectedClubs(sendingTags: string[]) {
  const selectedClubs = this.availableClubs
    .filter(club => club.selected)  // Filter clubs that are selected
    .map(club => ({
      clubId: club.id.toString(),  // Convert club.id to a string
      tags: sendingTags.length > 0 ? [...sendingTags] : [] // Assign sendingTags if not empty
    }));

  console.log('Selected Clubs with Tags:', selectedClubs);
  return selectedClubs; // Return the selected clubs to be used in subscription
}

getSelectedTags(): string[] {
  const selectedtags = this.availableTags.filter(tag => tag.selected).map(tag => tag.name);
  return selectedtags;
}

generateRandomSubId(): number {
  return Math.floor(Math.random() * 1000000); // Random ID between 0 and 999999
}

subscribeToSelectedClubs() {
  const selectedClubs = this.getSelectedClubs(this.getSelectedTags()); // Get selected clubs from getSelectedClubs

  console.log('Selected Club IDs:', selectedClubs);

  
  const username = localStorage.getItem('username');
  console.log(`Logged-in username: ${username}`);
  console.log(this.availableClubs);
  
  // Create a random subscription ID
  const subscriptionId = this.generateRandomSubId();
  console.log(`Generated Subscription ID: ${subscriptionId}`);
  
  // Fetch userId from localStorage (assuming it's stored there)
  const userId = localStorage.getItem('username'); // Make sure this key exists in localStorage
  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }
  
  // Call the API to subscribe
  selectedClubs.forEach(club => {
    const { clubId, tags } = club;
    this.eventService.subscribeToEvent(userId, subscriptionId, clubId, tags).subscribe({
      next: () => {
        console.log(`Successfully subscribed to Club ID: ${clubId}`);
      },
      error: (err) => {
        console.error(`Failed to subscribe to Club ID: ${clubId}`, err);
      },
      complete: () => {
        console.log(`Subscription process completed for Club ID: ${clubId}`);
      }
    });
  });
  
  
  // alert(`Subscribed to ${selectedClubs.map(club => club.clubId).join(', ')}`);
  
  this.closeModal(); // Close the modal after subscribing
  
}


  isTagSelected(tag: string): boolean {
    return this.filters.selectedTags.has(tag);
  }

  toggleTag(tag: string) {
    if (this.filters.selectedTags.has(tag)) {
      this.filters.selectedTags.delete(tag);
    } else {
      this.filters.selectedTags.add(tag);
    }
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.filters.selectedTags.size > 0 || 
           !!this.filters.searchText;
  }

  getSelectedTagsArray(): string[] {
    return Array.from(this.filters.selectedTags);
  }

  private applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !this.filters.searchText || 
        event.title.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
        event.description.toLowerCase().includes(this.filters.searchText.toLowerCase());

      const matchesTags = this.filters.selectedTags.size === 0 || 
        event.tags.some(tag => this.filters.selectedTags.has(tag));

      return matchesSearch && matchesTags;
    });
  }

  resetFilters() {
    this.filters = {
      searchText: '',
      selectedTags: new Set<string>()
    };
    this.filteredEvents = [...this.events];
  }
}