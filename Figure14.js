function createFigure14(containerId) {
    const data = {
        name: "Languages",
        children: [
            { name: "English", value: 1500000000 },
            { name: "French", value: 120000000 },
            { name: "Mandarin Chinese", value: 25000000 },
            { name: "Spanish", value: 18000000 },
            { name: "German", value: 15000000 },
            { name: "Japanese", value: 4000000 },
            { name: "Italian", value: 2000000 }
        ]
    };

    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 200, bottom: 10, left: 10 }; // Add space for the title and legend

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.right} ${height + margin.top}`) // Adjust for the title and legend
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", width + margin.right)
        .attr("height", height + margin.top);

    // Add title
    svg.append("text")
        .attr("x", (width + margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text("Number of Classroom Language Learners by Language (World Wide)")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("font-weight", "bold");

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const treemap = d3.treemap()
        .size([width, height])
        .padding(2);

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
                .html(`<strong>${d.data.name}</strong><br>Number: ${d.data.value.toLocaleString()}`);
        })
        .on("mousemove", (event) => {
            const [x, y] = d3.pointer(event, svg.node()); // svg is your main SVG selection
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
        .attr("y", d => d.y0 + margin.top + 20)
        .text(d => d.data.name)
        .attr("font-size", "12px")
        .attr("fill", "white")
        .style("pointer-events", "none")
        .style("text-shadow", "1px 1px 2px black");

    // Add numeric labels for English and French
    const numericLabels = [
        { name: "English", value: "1.5 billion" },
        { name: "French", value: "120 million" }
    ];

    numericLabels.forEach(label => {
        const node = root.leaves().find(d => d.data.name === label.name);
        if (node) {
            svg.append("text")
                .attr("x", node.x0 + 5)
                .attr("y", node.y0 + margin.top + 40)
                .text(label.value)
                .attr("font-size", "10px")
                .attr("fill", "white")
                .style("pointer-events", "none")
                .style("text-shadow", "1px 1px 2px black");
        }
    });

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
            .text(`${d.data.name}: ${d.data.value.toLocaleString()}`)
            .attr("font-size", "10px")
            .attr("fill", "black");
    });
}
