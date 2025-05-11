const txt = "huffman ejemplo";
const raiz = construirArbolHuffman(txt);
const data = nodoAD3(raiz);

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const g = svg.append("g").attr("transform", "translate(40,40)");

const treeLayout = d3.tree().size([width - 80, height - 80]);

const root = d3.hierarchy(data);
treeLayout(root);

// Enlaces (líneas)
g.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y)
    );

// Etiquetas de 0 / 1
g.selectAll(".edge-label")
    .data(root.links())
    .enter()
    .append("text")
    .attr("class", "edge-label")
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => (d.source.y + d.target.y) / 2 - 5)
    .text(d => d.target.data.edgeLabel || '');

// Nodos (círculos y texto)
const node = g.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`);

node.append("circle").attr("r", 12);
node.append("text")
    .attr("dy", 4)
    .attr("x", 0)
    .attr("text-anchor", "middle")
    .text(d => d.data.name);