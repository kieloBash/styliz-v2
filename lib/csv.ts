export const convertToCSV = (rows: any) => {
    if (!rows || rows.length === 0) return "";

    const headers = Object.keys(rows[0]).join(",");
    const values = rows.map((row: any) =>
        Object.values(row)
            .map(v => `"${v}"`) // wrap in quotes
            .join(",")
    );

    return [headers, ...values].join("\n");
};

export const downloadCSV = (csv: any, filename: any) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
