export const formatSource = source => {
    const firstPrdIdx = source.indexOf(".");
    if (firstPrdIdx < 0) return source;
    
    let sliceStartIdx = firstPrdIdx + 1;
    const afterFirstPeriod = source.slice(sliceStartIdx);
    const secondPrdIdx = afterFirstPeriod.indexOf(".") + sliceStartIdx;

    // if a second period is not found, the source is likely in the form
    // https://example.com, so it starts the slice after the second "/"
    if (secondPrdIdx === firstPrdIdx) sliceStartIdx = source.indexOf("/") + 2;

    return source.slice(sliceStartIdx, secondPrdIdx);
}