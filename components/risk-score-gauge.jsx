'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function RiskScoreGauge({ score = 75 }) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = 200;
        const height = 200;
        const radius = Math.min(width, height) / 2 - 10;

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Background arc
        const backgroundArc = d3.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI / 2);

        g.append('path')
            .attr('d', backgroundArc)
            .attr('fill', 'rgba(255, 255, 255, 0.1)');

        // Foreground arc (score)
        const foregroundArc = d3.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle(-Math.PI / 2 + (score / 100) * Math.PI);

        // Color based on score
        const color = score < 40 ? '#10b981' : score < 70 ? '#f59e0b' : '#ef4444';

        g.append('path')
            .attr('d', foregroundArc)
            .attr('fill', color)
            .style('filter', 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))');

        // Score text
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.3em')
            .attr('font-size', '36px')
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .text(score);

        // Label
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '2em')
            .attr('font-size', '12px')
            .attr('fill', 'rgba(255, 255, 255, 0.7)')
            .text('Risk Score');

    }, [score]);

    return <svg ref={svgRef} className="mx-auto"></svg>;
}
