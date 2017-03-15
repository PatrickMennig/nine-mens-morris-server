// ==== CONSTRUCTOR ====
function Turn() {
}

module.exports = Turn;


// ==== STATIC FUNCTIONS ====
Turn.describe = function () {
    return {
        name: 'turn',
        description: 'The object you need to pass in order to play a turn',
        fields: [
            {
                name: 'fromId',
                values: 'Integer (range 0...23) indicating the source field of your move, is null when playing a token from the pool.'
            },
            {
                name: 'toId',
                values: 'Integer (range 0...23) indicating the target field of your move.'
            },
            {
                name: 'removeId',
                values: 'Integer (range 0...23) indicating the field where you want to remove an enemy token. Only supply if you close a mill.'
            },
        ]
    }
};