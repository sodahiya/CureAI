export async function analyzeImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        console.log(res)
        throw new Error("Failed to analyze image");
    }
    return res.json();
}
