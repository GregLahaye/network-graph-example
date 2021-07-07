import { Component } from '@angular/core';
import { Node, Link } from '../network-graph/network-graph.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  links: Link[] = [];
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

  selection = '';

  constructor() {
    this.createLinks();
  }

  createLinks() {
    const links: Link[] = [];

    for (const source of this.nodes) {
      for (const target of this.nodes) {
        if (Math.random() > 0.9) {
          const value = Math.random() * 10;
          const link = { source: source.id, target: target.id, value };
          links.push(link);
        }
      }
    }

    this.links = links;
  }

  handleSelectionChange(id: string) {
    this.selection = id;
  }
}
