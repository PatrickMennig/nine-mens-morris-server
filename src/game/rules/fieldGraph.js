// ==== IMPORTS ====
const jsnx							= require('jsnetworkx');



// ==== INITIALIZING CODE ====
const initMorrisField = (G) => {

	G.addNodesFrom(new Array(24).fill(null).map((n,i) => i));
	G.addEdgesFrom([
		[0,1,{type:H}], [1,2,{type:H}],
		[2,14,{type:V}], [14,23,{type:V}],
		[23,22,{type:H}], [22,21,{type:H}],
		[21,9,{type:V}], [9,0,{type:V}],
		[1,4,{type:V}],
		[14,13,{type:H}],
		[22,19,{type:V}],
		[9,10,{type:H}],
		[3,4,{type:H}], [4,5,{type:H}],
		[5,13,{type:V}], [13,20,{type:V}],
		[20,19,{type:H}], [19,18,{type:H}],
		[18,10,{type:V}], [10,3,{type:V}],
		[4,7,{type:V}],
		[13,12,{type:H}],
		[19,16,{type:V}],
		[10,11,{type:H}],
		[6,7,{type:H}], [7,8,{type:H}],
		[8,12,{type:V}], [12, 17,{type:V}],
		[17,16,{type:H}], [16,15,{type:H}],
		[15,11,{type:V}], [11,6,{type:V}]
	]);

	return G;
};



// ==== LOCAL CONSTANTS ====
const H = 'HORIZONTAL';
const V = 'VERTICAL';
const field = initMorrisField(new jsnx.Graph());



// ==== PUBLIC FUNCTIONS ====
const neighbors = (idA, idB) => {
	const path = jsnx.bidirectionalShortestPath(field, idA, idB);
	return path ? path.length < 3 : false;
};


const getNeighbors = (id) => {
	return jsnx.neighbors(field, id);
};


const verticalNeighbors = (idA, idB) => {
	return neighborsType(idA, idB, V);
};


const horizontalNeighbors = (idA, idB) => {
	return neighborsType(idA, idB, H);
};


const getHorizontalRow = (id) => {
	return getRow(id, H);
};


const getVerticalRow = (id) => {
	return getRow(id, V);
};


exports.getNeighbors = getNeighbors;
exports.neighbors = neighbors;
exports.getVerticalRow = getVerticalRow;
exports.getHorizontalRow = getHorizontalRow;
exports.horizontalNeighbors = horizontalNeighbors;
exports.verticalNeighbors = verticalNeighbors;




// ==== HELPER FUNCTIONS ====
function neighborsType(idA, idB, targetType) {
	const n = neighbors(idA, idB);
	if(!n) { return false; }
	const type = field.edge.get(idA)['_numberValues'][idB]['type'];
	return type === targetType;
}


function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}


function getRow (id, type) {

	// get the neighbors of the target node
	const neighbors = getNeighbors(id);

	let row = [id];

	neighbors.forEach(n => {

		// skip if this is not a vertical neighbor?
		if(!neighborsType(id, n, type)){ return; }

		// store this neighbor already if it is vertical
		row.push(n);

		// get the next neighbors of the neighbor
		const localNeighbors = getNeighbors(n);

		// look at all next neighbors and store those that are vertical neighbors
		localNeighbors.forEach(nn => {
			// skip if this is not a vertical neighbor?
			if(!neighborsType(n, nn, type)){ return; }

			// store this neighbor
			row.push(nn);
		});
	});

	return row.filter(onlyUnique).sort((a,b)=> a-b);
}



/*
 console.log(exports.verticalNeighbors(0,9) === true);
 console.log(exports.verticalNeighbors(0,1) === false);
 console.log(exports.verticalNeighbors(0,23) === false);
 console.log(exports.horizontalNeighbors(0,1) === true);
 console.log(exports.horizontalNeighbors(4,7) === false);
 console.log(exports.horizontalNeighbors(0,23) === false);
*/
//exports.neighbors(0,14);
//console.dir(exports.getVerticalRow(10));
//console.dir(exports.getHorizontalRow(10));
