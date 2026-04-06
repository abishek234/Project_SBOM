'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DependencyGraph() {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = 600;
        const height = 400;

        svg.attr('width', width).attr('height', height);

        // Sample dependency data
        const nodes = [
            { id: 'app', group: 1, risk: 20 },
            { id: 'react', group: 2, risk: 10 },
            { id: 'express', group: 2, risk: 30 },
            { id: 'lodash', group: 3, risk: 50 },
            { id: 'axios', group: 3, risk: 25 },
            { id: 'moment', group: 3, risk: 80 },
            { id: 'd3', group: 3, risk: 15 },
        ];

        const links = [
            { source: 'app', target: 'react' },
            { source: 'app', target: 'express' },
            { source: 'react', target: 'lodash' },
            { source: 'express', target: 'axios' },
            { source: 'express', target: 'moment' },
            { source: 'react', target: 'd3' },
        ];

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', 'rgba(255, 255, 255, 0.3)')
            .attr('stroke-width', 2);

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 20)
            .attr('fill', d => {
                if (d.risk < 30) return '#10b981';
                if (d.risk < 60) return '#f59e0b';
                return '#ef4444';
            })
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))');

        const label = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .join('text')
            .text(d => d.id)
            .attr('font-size', 12)
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .attr('dy', -25);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

    }, []);

    return (
        <div className="flex justify-center">
            <svg ref={svgRef} className="max-w-full"></svg>
        </div>
    );
}
