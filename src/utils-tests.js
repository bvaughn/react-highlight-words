import * as Chunks from './utils.js'

export const Tests = () => {

    const assert = (boolValue, message) => {
        if (!boolValue) {
            throw new Error("Assertion failed" + (message == null ? '' : ': ' + message))
        }
    }

    const findChunk = (chunks, start, end) =>
        chunks.find((chunk) => chunk.start == start && chunk.end == end)

    const assertChunks = (actualChunks, expectedChunks) => {
        assert(actualChunks.length == expectedChunks.length, "Expected " + expectedChunks.length + ", got " + actualChunks.length)
        expectedChunks.forEach((expected) => {
            assert(findChunk(actualChunks, expected.start, expected.end) != null, "Couldn't find expected chunk: " + expected.start + ":" + expected.end)
        })
    }

    /*
     * Here is the TEXT string on one line starting at character 0, so you can use your text
     * editor to calculate the expected offsets of qui/uam/isquam:

Quae quo aut officiis voluptas exercitationem. Sapiente quod magni dolore cupiditate perferendis. Qui et ratione quisquam est. Similique et sint consequatur tenetur accusamus. Qui dolorum at quo voluptatum aliquam odit qui. Et alias velit deleniti doloremque esse adipisci autem.

     */
    const TEXT =
        "Quae quo aut officiis voluptas exercitationem. " +
        "Sapiente quod magni dolore cupiditate perferendis. " +
        "Qui et ratione quisquam est. " +
        "Similique et sint consequatur tenetur accusamus. " +
        "Qui dolorum at quo voluptatum aliquam odit qui. " +
        "Et alias velit deleniti doloremque esse adipisci autem."

    const expectedQuiChunks = [
        {start: 98, end: 101},
        {start: 113, end: 116},
        {start: 176, end: 179},
        {start: 219, end: 222},
    ];

    const expectedUamChunks = [
        {start: 118, end: 121},
        {start: 210, end: 213},
    ];

    const expectedIsquamChunks = [
        {start: 115, end: 121},
    ];

    // "qui"
    // 4 occurrences of "qui" (some with capital "Q", others without).
    // None of them cross.
    (function() {
        const rawChunks = Chunks.findChunks(TEXT, ["qui"])
        assert(rawChunks.length == 4)
        assertChunks(rawChunks, expectedQuiChunks)

        const combinedChunks = Chunks.combineChunks(rawChunks)
        assert(combinedChunks.length == 4)
        assertChunks(combinedChunks, expectedQuiChunks)
    })();

    // "qui" + "uam"
    // 4 + 2 occurrences, with no crossover.
    (function() {
        const expectedChunks = expectedQuiChunks.concat(expectedUamChunks)
        const rawChunks = Chunks.findChunks(TEXT, ["qui", "uam"])
        assert(rawChunks.length == expectedChunks.length)
        assertChunks(rawChunks, expectedChunks)

        const combinedChunks = Chunks.combineChunks(rawChunks)
        assert(combinedChunks.length == expectedChunks.length, "After combining, expected 6 chunks, got: " + combinedChunks.length)
        assertChunks(combinedChunks, expectedChunks)
    })();

    // "qui" + "isquam"
    // There is 4 "qui" and one "isquam" occurrence.
    // However, the "isquam" crosses over with a "qui", so there should only be
    // a total of 4 results (one of which is "quisquam") when all is said and done.
    (function() {
        const rawChunks = Chunks.findChunks(TEXT, ["qui", "isquam"])
        assert(rawChunks.length == 5);
        assertChunks(rawChunks, expectedQuiChunks.concat(expectedIsquamChunks))

        const expectedChunks = [
            {start: 98, end: 101},
            {start: 113, end: 121}, // This is from combining "qui" at 113:116 and "isquam" at 115:121
            {start: 176, end: 179},
            {start: 219, end: 222},
        ]

        const combinedChunks = Chunks.combineChunks(rawChunks)
        assert(combinedChunks.length == 4)
        assertChunks(combinedChunks, expectedChunks)

        const assertCorrectHighlighted = (processedChunks) => {

            // Check that all four matched chunks are marked as highlighted.
            expectedChunks.forEach((chunk) => {
                const found = findChunk(processedChunks, chunk.start, chunk.end)
                assert(found != null)
                assert(found.highlight, `Expected chunk ${chunk.start}:${chunk.end} to be highlighted, it wasn't`)
            })

            // Then check all other chunks, and ensure they are not the highlighted ones.
            assert(
                processedChunks
                    .filter((chunk) => !chunk.highlight && findChunk(expectedChunks, chunk.start, chunk.end) == null)
                    .length == 5
            )
            
        }

        assertCorrectHighlighted(Chunks.fillInChunks(combinedChunks, TEXT.length))
        assertCorrectHighlighted(Chunks.findAll(["qui", "isquam"], TEXT))

    })();

}