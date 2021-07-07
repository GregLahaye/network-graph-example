import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import * as d3 from 'd3';
import {
  Selection,
  Simulation,
  SimulationNodeDatum,
  SimulationLinkDatum,
  D3DragEvent,
} from 'd3';

export interface Node extends SimulationNodeDatum {
  id: string;
  group: string;
}

export interface Link extends SimulationLinkDatum<Node> {
  value: number;
}

interface DragEvent extends D3DragEvent<SVGCircleElement, Node, Node> {}

@Component({
  selector: 'app-network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls: ['./network-graph.component.scss'],
})
export class NetworkGraphComponent implements OnChanges {
  @Input() links: Link[] = [];
  @Input() nodes: Node[] = [];

  @Output() selectionChange = new EventEmitter<string>();

  width = 1000;
  height = 400;

  svg?: Selection<SVGSVGElement, unknown, HTMLElement, any>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.links || changes.nodes) {
      this.renderNetworkGraph();
    }
  }

  renderNetworkGraph() {
    this.clearNetworkGraph();

    const color = (d: Node) => {
      const scale = d3.scaleOrdinal(d3.schemeCategory10);
      return scale(d.group);
    };

    const simulation = d3
      .forceSimulation<Node>(this.nodes)
      .force(
        'link',
        d3.forceLink<Node, Link>(this.links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    this.svg = d3
      .select('#root')
      .append('svg')
      .attr('viewBox', [0, 0, this.width, this.height] as any);

    const link = this.svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(this.links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value));

    const node = this.svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(this.nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', color)
      .on('click', this.handleNodeClick.bind(this))
      .call((simulation: any) => this.drag(simulation));

    node.append('title').text((d) => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as Node).x!)
        .attr('y1', (d) => (d.source as Node).y!)
        .attr('x2', (d) => (d.target as Node).x!)
        .attr('y2', (d) => (d.target as Node).y!);

      node.attr('cx', (d) => d.x!).attr('cy', (d) => d.y!);
    });
  }

  drag(simulation: Simulation<Node, Link>) {
    const dragStarted = (event: DragEvent) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };

    const dragged = (event: DragEvent) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    const dragEnded = (event: DragEvent) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    };

    return d3
      .drag<SVGCircleElement, Node>()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded);
  }

  clearNetworkGraph() {
    this.svg?.remove();
  }

  handleNodeClick(_: unknown, node: Node) {
    this.selectionChange.emit(node.id);
  }
}
