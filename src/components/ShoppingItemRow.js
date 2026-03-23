export default function ShoppingItemRow({
    item,
    isEditing,
    onToggleBought,
    onUpdateItem,
    onToggleEdit,
    onRemoveItem,
  }) {
    return (
      <div className="rounded-xl border border-stone-100 px-3 py-3 bg-white">
        <div className="grid grid-cols-[auto,1fr,auto] gap-3 items-start">
          <input
            type="checkbox"
            checked={item.bought}
            onChange={() => onToggleBought(item.id)}
            className="mt-2 h-4 w-4"
          />
  
          {!isEditing ? (
            <div>
              <div
                className={`font-medium ${
                  item.bought ? "line-through text-stone-400" : ""
                }`}
              >
                {item.name}
              </div>
              <div className="text-sm text-stone-500">
                {item.qty} {item.unit} · € {item.price} p/st{" "}
                {item.notes ? `· ${item.notes}` : ""}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-2">
              <input
                className="rounded-lg border border-stone-200 px-3 py-2"
                value={item.name}
                onChange={(e) => onUpdateItem(item.id, "name", e.target.value)}
              />
              <input
                className="rounded-lg border border-stone-200 px-3 py-2"
                value={item.phase}
                onChange={(e) => onUpdateItem(item.id, "phase", e.target.value)}
              />
              <select
                className="rounded-lg border border-stone-200 px-3 py-2"
                value={item.category}
                onChange={(e) => onUpdateItem(item.id, "category", e.target.value)}
              >
                <option>Drank</option>
                <option>Eten</option>
                <option>Food</option>
              </select>
              <input
                className="rounded-lg border border-stone-200 px-3 py-2"
                type="number"
                value={item.qty}
                onChange={(e) => onUpdateItem(item.id, "qty", e.target.value)}
              />
              <input
                className="rounded-lg border border-stone-200 px-3 py-2"
                value={item.unit}
                onChange={(e) => onUpdateItem(item.id, "unit", e.target.value)}
              />
              <input
                className="rounded-lg border border-stone-200 px-3 py-2"
                type="number"
                value={item.price}
                onChange={(e) => onUpdateItem(item.id, "price", e.target.value)}
              />
              <input
                className="rounded-lg border border-stone-200 px-3 py-2 md:col-span-2"
                value={item.notes}
                onChange={(e) => onUpdateItem(item.id, "notes", e.target.value)}
                placeholder="Notities"
              />
            </div>
          )}
  
          <div className="text-right min-w-[120px]">
            <div className="text-sm font-medium">
              € {(item.qty * item.price).toFixed(2)}
            </div>
            <div className="mt-2 flex gap-2 justify-end flex-wrap">
              <button
                onClick={() => onToggleEdit(item.id)}
                className="text-xs text-stone-500 hover:text-stone-900"
              >
                {isEditing ? "Klaar" : "Bewerk"}
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-xs text-stone-400 hover:text-red-500"
              >
                Verwijder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }