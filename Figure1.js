function createFigure1(containerId) {
    const data = {
        name: "Languages",
        children: [
            { name: "English", value: 49.4 },
            { name: "Spanish", value: 6.0 },
            { name: "German", value: 5.5 },
            { name: "Japanese", value: 5.0 },
            { name: "French", value: 4.4 },
            { name: "Russian", value: 4.0 },
            { name: "Portuguese", value: 3.8 },
            { name: "Italian", value: 2.7 },
            { name: "Dutch, Flemish", value: 2.1 },
            { name: "Polish", value: 1.8 },
            { name: "Turkish", value: 1.8 },
            { name: "Persian", value: 1.3 },
            { name: "Chinese", value: 1.2 },
            { name: "Vietnamese", value: 1.1 },
            { name: "Indonesian", value: 1.1 },
            { name: "Czech", value: 1.0 },
            { name: "Korean", value: 0.8 },
            { name: "Ukrainian", value: 0.6 },
            { name: "Hungarian", value: 0.6 },
            { name: "Arabic", value: 0.5 },
            { name: "Romanian", value: 0.5 },
            { name: "Swedish", value: 0.5 },
            { name: "Greek", value: 0.5 },
            { name: "Hebrew", value: 0.4 },
            { name: "Danish", value: 0.4 },
            { name: "Finnish", value: 0.4 },
            { name: "Slovak", value: 0.4 },
            { name: "Thai", value: 0.3 },
            { name: "Bulgarian", value: 0.3 },
            { name: "Serbian", value: 0.2 },
            { name: "Croatian", value: 0.2 },
            { name: "Lithuanian", value: 0.2 },
            { name: "Norwegian Bokmål", value: 0.2 },
            { name: "Slovenian", value: 0.1 },
            { name: "Catalan, Valencian", value: 0.1 },
            { name: "Estonian", value: 0.1 },
            { name: "Norwegian", value: 0.1 },
            { name: "Latvian", value: 0.1 }
        ]
    };

    const width = 900;
    const height = 600;
    const margin = { top: 40, right: 150, bottom: 10, left: 10 }; // Space for title and legend

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.right} ${height + margin.top}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", width + margin.right)
        .attr("height", height + margin.top);

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text("Share of Most Common Languages Spoken on the Web")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("font-weight", "bold");

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const treemap = d3.treemap()
        .size([width, height])
        .padding(1);

    treemap(root);

    const colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Add tooltip
    const tooltip = d3.select(`#${containerId}`)
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "8px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("display", "none");

    // Draw rectangles
    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0 + margin.top)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colors(d.data.name))
        .style("stroke", "white")
        .style("stroke-width", "1px")
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`<strong>${d.data.name}</strong><br>Share: ${d.data.value}%`);
        })
        .on("mousemove", event => {
            const [x, y] = d3.pointer(event, svg.node());
            tooltip.style("top", `${y + 10}px`)
                .style("left", `${x + 10}px`);
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });

    // Add readable text labels for language names
    svg.selectAll("text.label")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => d.x0 + 5)
        .attr("y", d => d.y0 + margin.top + 15)
        .text(d => d.data.name)
        .attr("font-size", "10px")
        .attr("fill", "white")
        .style("pointer-events", "none")
        .style("text-shadow", "1px 1px 2px black");

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 10}, ${margin.top})`);

    root.leaves().forEach((d, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", colors(d.data.name));

        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 12)
            .text(`${d.data.name}: ${d.data.value}%`)
            .attr("font-size", "10px")
            .attr("fill", "black");
    });
}
