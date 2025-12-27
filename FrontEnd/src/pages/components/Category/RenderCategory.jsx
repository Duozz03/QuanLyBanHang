export default function renderRows(nodes, level, expandedIds, toggle, onEdit, onDelete) {
    if(!nodes || nodes.length === 0 )
      return null;
     
  return nodes.map((node) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.includes(node.id);

    return (
      <>
        <tr key={node.id}>
          <td>
            <div className="tree-cell" style={{ paddingLeft: level * 20 }}>
              {hasChildren && (
                <span
                  className="caret"
                  onClick={() => toggle(node.id)}
                >
                  {isExpanded ? "▾" : "▸"}
                </span>
              )}
              <span className="node-name">{node.name}</span>
            </div>
          </td>

          <td className="">0</td>

          <td className="">
            <button className="icon-btn" onClick={() => onEdit(node)}>✏️</button>
            <button className="icon-btn" onClick={() => onDelete(node)}>🗑️</button>
          </td>
        </tr>

        {hasChildren &&
          isExpanded &&
          renderRows(
            node.children,
            level + 1,
            expandedIds,
            toggle,
            onEdit,
            onDelete
          )}
      </>
    );
  });
}