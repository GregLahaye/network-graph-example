import { Component, OnInit } from '@angular/core';
import { Node, Link } from '../network-graph/network-graph.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  links: Link[] = [
    { source: 'A', target: 'B', value: 1 },
    { source: 'B', target: 'C', value: 1 },
    { source: 'C', target: 'E', value: 1 },
    { source: 'E', target: 'G', value: 1 },
    { source: 'A', target: 'G', value: 1 },
    { source: 'E', target: 'J', value: 1 },
  ];
  nodes: Node[] = [
    { id: 'A', group: '1' },
    { id: 'B', group: '1' },
    { id: 'C', group: '1' },
    { id: 'D', group: '1' },
    { id: 'E', group: '1' },
    { id: 'F', group: '1' },
    { id: 'G', group: '2' },
    { id: 'H', group: '2' },
    { id: 'I', group: '2' },
    { id: 'J', group: '2' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
