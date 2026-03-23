export default function PrintShoppingList({ items, phases }) {
    return (
      <div className="print-section hidden print:block">
        <div className="print-title">Boodschappenlijst</div>
        <div style={{ marginBottom: "16px" }}>Dinner dashboard · printversie</div>
  
        <div className="print-group">
          <div className="print-subtitle">Drank</div>
  
          {phases.map((phase) => {
            const phaseItems = items.filter(
              (item) => item.category === "Drank" && item.phase === phase
            );
  
            if (phaseItems.length === 0) return null;
  
            return (
              <div key={`drank-${phase}`} style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  {phase}
                </div>
  
                {phaseItems.map((item) => (
                  <div key={item.id} className="print-row">
                    <div className="print-row-left">
                      <div>
                        <span className="print-checkbox" />
                        <strong>{item.name}</strong>
                      </div>
                      <div className="print-notes">
                        {item.qty} {item.unit} · € {item.price} p/st
                        {item.notes ? ` · ${item.notes}` : ""}
                      </div>
                    </div>
                    <div>€ {(item.qty * item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
  
        <div className="print-group">
          <div className="print-subtitle">Eten</div>
  
          {phases.map((phase) => {
            const phaseItems = items.filter(
              (item) =>
                (item.category === "Eten" || item.category === "Food") &&
                item.phase === phase
            );
  
            if (phaseItems.length === 0) return null;
  
            return (
              <div key={`eten-${phase}`} style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  {phase}
                </div>
  
                {phaseItems.map((item) => (
                  <div key={item.id} className="print-row">
                    <div className="print-row-left">
                      <div>
                        <span className="print-checkbox" />
                        <strong>{item.name}</strong>
                      </div>
                      <div className="print-notes">
                        {item.qty} {item.unit} · € {item.price} p/st
                        {item.notes ? ` · ${item.notes}` : ""}
                      </div>
                    </div>
                    <div>€ {(item.qty * item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }