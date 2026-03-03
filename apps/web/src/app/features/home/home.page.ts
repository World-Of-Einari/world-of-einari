import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatChipsModule, MatCardModule],
  styleUrls: ['./home.page.scss'],
  templateUrl: './home.page.html',
})
export class HomePage {}
