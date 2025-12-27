
import { useEffect, useState } from "react";
import "./ListCategory.css"
import axios from "axios";


/* ===================== COMPONENT ===================== */
export default function ListCategory() {
  const [expandedIds, setExpandedIds] = useState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [newName, setNewName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
const [selectedChildId, setSelectedChildId] = useState("");
const [category, setcategory] = useState([]);


const [openCreate, setOpenCreate] = useState(false);
const [createName, setCreateName] = useState("");
const [createParentId, setCreateParentId] = useState("");



  const loadCategory = async () => {
    try{
      const token = 
      localStorage.getItem("accessToken") ||
       sessionStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/categories`,
         { headers:{ Authorization: `Bearer ${token}` }  } 
      );
        const data = res.data.result || [];
        console.log("data", data);
      
      setcategory(data);  
    } catch (err){
      console.error(err);
      alert("Lỗi khi tải loại");
    }
  };
useEffect(() => {
  loadCategory();
}, []);




///////////////////////////////////////////
  const onCreate = async () => {
    if(!validateCreateCategory()) return;
    
    try{
      const token = 
      localStorage.getItem("accessToken") ||
       sessionStorage.getItem("accessToken");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/categories`,
        {
          
          name:createName,
          parentId:createParentId || null
        },
         { headers:{ Authorization: `Bearer ${token}` }  } 
      );
        alert("them ok ");
        setCreateName("");
      loadCategory();
    } catch (err){
      console.error(err);
      alert("Lỗi khi tải loại");
    }
  };
  



function flattenTree(nodes, level = 0, result = []) {
  for (const n of nodes) {
    result.push({
      id: n.id,
      name: `${"— ".repeat(level)}${n.name}`,
      level
    });
    if (n.children?.length) {
      flattenTree(n.children, level + 1, result);
    }
  }
  return result;
}



const validateCreateCategory = () => {
  if (!createName.trim()) {
    alert("⚠️ Vui lòng nhập tên nhóm hàng");
    return;
  }

  // 🔴 KIỂM TRA GIỚI HẠN 3 CẤP
  if (createParentId) {
    const info = findNodeInfo(category, Number(createParentId));

    // 🚫 nếu nhóm cha là NODE CHÁU (level = 2)
    if (info && info.level === 2) {
      alert("❌ Hệ thống chỉ hỗ trợ tối đa 3 cấp nhóm hàng");
      return;
    }
  }
  return true;
};





  /* ---------- TOGGLE ---------- */
  const toggle = (id) => {
    setExpandedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  /* ---------- DELETE ---------- */
  const canDelete = (node) => !node.children || node.children.length === 0;

  const deleteNode = (nodes, id) =>
    nodes
      .filter((n) => n.id !== id)
      .map((n) => ({
        ...n,
        children: deleteNode(n.children || [], id)
      }));

  const onDelete = (node) => {
    if (!canDelete(node)) {
      alert("❌ Không thể xóa vì còn nhóm con");
      return;
    }
    setcategory((prev) => deleteNode(prev, node.id));
  };

  /* ---------- EDIT ---------- */
  const onEdit = (node) => {
  const info = findNodeInfo(category, node.id);

  setEditingNode({ ...node, level: info.level });
  setNewName(node.name);

  setSelectedParentId("");
  setSelectedChildId("");
};

  /* ---------- TREE UTILS ---------- */
  //Cắt cây cũ 
  const extractNode = (nodes, id) => {
    let found = null;

    const newTree = nodes
      .filter((n) => {
        if (n.id === id) {
          found = n;
          return false;
        }
        return true;
      })
      .map((n) => ({
        ...n,
        children: n.children
          ? extractNode(n.children, id).tree
          : []
      }));

    return { tree: newTree, node: found };
  };

  // tìm node trả về thông tin node, cấp node, thông tin cha của nó
  function findNodeInfo(tree, id, level = 0, parent = null) {
  for (const node of tree) {
    if (node.id === id) {
      return { node, level, parent };
    }
    if (node.children?.length) {
      const found = findNodeInfo(node.children, id, level + 1, node);
      if (found) return found;
    }
  }
  return null;
}

  //thêm node vào node cha
  const insertNode = (nodes, parentId, node) =>
    nodes.map((n) => {
      if (n.id === parentId) {
        return { ...n, children: [...(n.children || []), node] };
      }
      return {
        ...n,
        children: insertNode(n.children || [], parentId, node)
      };
    });

  /* ---------- SAVE ---------- */
  //cắt node đang sửa ra khỏi cây, cập nhật tên node, gắn node trở lại vào cây theo level và chọn cha 
const onSave = () => {
  let { tree: removedTree, node } = extractNode(category, editingNode.id);
  node = { ...node, name: newName };

  // NODE CHA → chỉ đổi tên
  if (editingNode.level === 0) {
    setcategory([...removedTree, node]);
  }

  // NODE CON
  else if (editingNode.level === 1) {
    if (!selectedParentId) {
      setcategory([...removedTree, node]);
    } else {
      setcategory(insertNode(removedTree, Number(selectedParentId), node));
    }
  }

  // NODE CHÁU
  else {
    if (!selectedParentId) {
      setcategory([...removedTree, node]); // lên CHA
    } else if (selectedChildId) {
      setcategory(insertNode(removedTree, Number(selectedChildId), node));
    } else {
      setcategory(insertNode(removedTree, Number(selectedParentId), node));
    }
  }

  setEditingNode(null);
};


  /* ===================== RENDER ===================== */
  return (
    <div className="kv-wrapper">
  {/* HEADER */}
  <div className="kv-header">
    <div>
      <h3>Nhóm hàng</h3>
      <p>Tổ chức nhóm hàng theo cấp bậc để lọc và chọn hàng loạt hàng hóa tiện lợi hơn.</p>
    </div>

    <div className="kv-actions">
      <button className="btn-outline">↕ Thứ tự hiển thị</button>
      <button className="btn-primary" onClick={() => setOpenCreate(true)}>
  ＋ Tạo nhóm hàng
</button>

    </div>
  </div>

  {/* TABLE */}
  <table className="kv-table">
    <thead>
      <tr>
        <th>Tên nhóm hàng</th>
        <th className="center">SL hàng hóa</th>
        <th className="center">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      {renderRows(category, 0, expandedIds, toggle, onEdit, onDelete)}
    </tbody>
  </table>
{openCreate && (
  <div style={modalStyle}>
    <div style={{ ...modalBox, width: 420 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Tạo nhóm hàng</h4>
        <button onClick={() => setOpenCreate(false)}>✕</button>
      </div>


      
      {/* TÊN */}
      <label>Tên nhóm hàng</label>
      <input
        placeholder="Nhập tên nhóm hàng"
        value={createName}
        onChange={(e) => setCreateName(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      {/* NHÓM CHA */}
      <label>Nhóm cha</label>
      <select
        value={createParentId}
        onChange={(e) => setCreateParentId(e.target.value)}
        style={{ width: "100%" }}
      >
        <option value="">Chọn nhóm hàng</option>
        {flattenTree(category).map((n) => (
          <option key={n.id} value={n.id}>
            {n.name}
          </option>
        ))}
      </select>

      {/* ACTION */}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <button onClick={() => setOpenCreate(false)}>Bỏ qua</button>
        <button className="btn-primary" onClick={onCreate}>
          Tạo nhóm
        </button>
      </div>
    </div>
  </div>
)}


</div>

  );
  function renderRows(nodes, level, expandedIds, toggle, onEdit, onDelete) {
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
}

/* ===================== RECURSIVE RENDER ===================== */

/* ===================== MODAL STYLE ===================== */
const modalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalBox = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  minWidth: 380
};




