import React from 'react';

declare global {
    /**
     * Global constants used to refresh the connected user token.
     */
    interface Window {
        vis: any;
    }
}

const Vis = ({ graph }: { graph: any }) => {
    React.useEffect(() => {
        const { vis } = window;
        // create an array with nodes
        var nodes = new vis.DataSet(graph.nodes);

        // create an array with edges
        // @ts-ignore
        var edges = new vis.DataSet(graph.edges);

        // create a network
        var container = document.getElementById('dependency-graph');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            layout: {
                improvedLayout: false,
            },
            "edges": {
                "smooth": {
                    "forceDirection": "none"
                }
            },
            "physics": {
                "minVelocity": 0.75,
                "barnesHut": {
                    "gravitationalConstant": -6700
                  },
            }
        };

        // @ts-ignore
        new vis.Network(container, data, options);
    });

    return <div id="dependency-graph" />;
};

export { Vis };