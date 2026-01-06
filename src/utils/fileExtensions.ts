export const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() : "";
};