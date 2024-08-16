import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatAnchor } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CustomDatePipe } from '../date.pipe';
import { environment } from '../../environments/environment';

interface Country {
  countryCode: string;
  name: string;
}

interface RandomCountry {
  countryName: string;
  name: string;
  date: string;
}

interface Holiday {
  date: string;
  name: string;
  countryCode: string;
  types: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    MatFormField,
    MatInput,
    MatList,
    MatListItem,
    MatLabel,
    MatAnchor,
    MatCard,
    MatCardContent,
    CustomDatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private apiUrl = environment.API_URL;
  searchQuery = '';
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  randomCountries: RandomCountry[] = [];
  isInputFocused = false;
  isCountriesNotFound = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getCountries();
    this.getRandomCountries();
  }

  getCountries() {
    this.http
      .get<Country[]>(this.apiUrl + 'AvailableCountries')
      .subscribe((data: Country[]) => {
        this.countries = data;
        this.getFilteredCountries();
      });
  }

  getFilteredCountries() {
    this.filteredCountries = this.countries.filter(
      (country) =>
        country.name &&
        country.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
    this.isCountriesNotFound = !this.filteredCountries.length;
  }

  getRandomCountries() {
    this.http
      .get<Holiday[]>(this.apiUrl + 'NextPublicHolidaysWorldwide')
      .subscribe((data: Holiday[]) => {
        const randomIndexes = Array.from({ length: 3 }, () =>
          Math.floor(Math.random() * data.length),
        );
        this.randomCountries = randomIndexes.map((index) => {
          const holiday = data[index];
          const country = this.countries.find(
            (c) => c.countryCode === holiday.countryCode,
          );
          return {
            ...holiday,
            countryName: country ? country.name : 'Unknown',
          };
        });
      });
  }

  navigateToCountry(countryCode: string) {
    this.router
      .navigate([`/country/${countryCode.toLowerCase()}`])
      .then((r) => r);
  }

  onFocus() {
    this.isInputFocused = true;
  }

  onBlur() {
    setTimeout(() => (this.isInputFocused = false), 200);
  }
}
