export function sorting(
  query: string,
  orderBy?: string,
  order?: string
): string {
  if (orderBy) {
    let sortColumn: string;
    switch (orderBy) {
      case "created_at":
        sortColumn = "created_at";
        break;
      case "title":
        sortColumn = "title";
        break;
      default:
        throw new Error("Criterio de orden no válido");
    }
    const sortDir = order === "desc" ? "DESC" : "ASC";

    query += ` ORDER BY ${sortColumn} ${sortDir}`;
  }

  return query;
}
