function FormatTitle(title) {
    if (!title) return "";
    const temp = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    temp1 = temp.toLowerCase()
    temp2 = temp1.replace(/\s+/g, '');

    return temp2
}

module.exports = FormatTitle