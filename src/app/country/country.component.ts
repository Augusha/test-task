import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgClass } from '@angular/common';
import { CustomDatePipe } from '../date.pipe';

interface Holiday {
  name: string;
  localName: string;
  date: string;
  types: string[];
}

interface CountryInfo {
  commonName: string;
  officialName: string;
  region: string;
  subRegion: string;
  population: number;
}

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgForOf, NgClass, CustomDatePipe],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css',
})
export class CountryComponent implements OnInit {
  apiUrl = 'https://date.nager.at/api/v3/';
  countryCode = '';
  holidays: Holiday[] = [];
  countryInfo: CountryInfo = {} as CountryInfo;
  currentYear: number = new Date().getFullYear();
  years: number[] = Array.from({ length: 11 }, (_, i) => 2020 + i);

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.countryCode = params['countryCode'];
      this.fetchCountryInfo();
      this.fetchHolidays(this.currentYear);
    });
  }

  fetchCountryInfo() {
    this.http
      .get<CountryInfo>(`${this.apiUrl}CountryInfo/${this.countryCode}`)
      .subscribe((data) => {
        this.countryInfo = data;
      });
  }

  fetchHolidays(year: number) {
    this.http
      .get<Holiday[]>(`${this.apiUrl}PublicHolidays/${year}/${this.countryCode}`)
      .subscribe((data) => {
        this.holidays = data;
      });
  }

  switchYear(year: number) {
    this.currentYear = year;
    this.fetchHolidays(year);
  }

  isSelectedYear(year: number): boolean {
    return this.currentYear === year;
  }
}
