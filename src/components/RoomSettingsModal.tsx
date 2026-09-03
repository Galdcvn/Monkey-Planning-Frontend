import { useState } from "react";
import type { Socket } from "socket.io-client";
import { Crown, Trash2, Users, Palette } from "lucide-react";
import type { Room } from "../lib/types";
import mesa1 from "../assets/mesa1.png";
import mesa2 from "../assets/mesa2.png";
import mesa3 from "../assets/mesa3.png";
import mesa4 from "../assets/mesa4.png";
import mesa5 from "../assets/mesa5.png";
import mesa6 from "../assets/mesa6.png";
import mesa7 from "../assets/mesa7.png";

const COLORS: { id: string; label: string; css: string }[] = [
  { id: "light", label: "Branco", css: "#f5f5f7" },
  { id: "dark", label: "Escuro", css: "#16171d" },
  { id: "dark-blue", label: "Azul-escuro", css: "#0f1a2c" },
  { id: "dark-purple", label: "Roxo-escuro", css: "#1b1128" },
  { id: "dark-green", label: "Verde-escuro", css: "#0c1f1a" },
  { id: "dark-red", label: "Vinho", css: "#241216" },
];

const TABLES: { id: string; label: string; img: string }[] = [
  { id: "mesa1", label: "Mesa 1", img: mesa1 },
  { id: "mesa2", label: "Mesa 2", img: mesa2 },
  { id: "mesa3", label: "Mesa 3", img: mesa3 },
  { id: "mesa4", label: "Mesa 4", img: mesa4 },
  { id: "mesa5", label: "Mesa 5", img: mesa5 },
  { id: "mesa6", label: "Mesa 6", img: mesa6 },
  { id: "mesa7", label: "Mesa 7", img: mesa7 },
];

interface RoomSettingsModalProps {
  room: Room;
  socket: Socket;
  userId: string;
  onClose: () => void;
}

type Tab = "players" | "customize";

export function RoomSettingsModal({
  room,
  socket,
  userId,
  onClose,
}: RoomSettingsModalProps) {
  const [tab, setTab] = useState<Tab>("players");
  const [error, setError] = useState("");
  const isCreator = room.createdBy === userId;

  const removePlayer = (targetUserId: string, name: string) => {
    if (!isCreator) return;
    if (targetUserId === room.createdBy) return;
    if (!window.confirm(`Remover ${name} da sala?`)) return;
    socket.emit("player:remove", {
      roomId: room.id,
      userId,
      targetUserId,
    });
    onClose();
  };

  const updateSettings = (patch: { color?: string; table?: string }) => {
    if (!isCreator) return;
    socket.emit("room:updateSettings", {
      roomId: room.id,
      userId,
      ...patch,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal room-settings" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
        <h2 className="modal-title">Configurações da sala</h2>

        <div className="room-settings-tabs" role="tablist">
          <button
            className={`room-settings-tab${tab === "players" ? " active" : ""}`}
            onClick={() => setTab("players")}
            role="tab"
          >
            <Users size={15} /> Jogadores
          </button>
          <button
            className={`room-settings-tab${tab === "customize" ? " active" : ""}`}
            onClick={() => setTab("customize")}
            role="tab"
          >
            <Palette size={15} /> Personalizar sala
          </button>
        </div>

        {error && <p className="field-error">{error}</p>}

        {tab === "players" && (
          <div className="room-settings-panel">
            <ul className="room-players">
              {room.players.map((p) => (
                <li
                  key={p.id}
                  className={`room-player${p.id === room.createdBy ? " owner" : ""}`}
                >
                  <div className="room-player-avatar">
                    <img src={p.icon} alt="" />
                  </div>
                  <div className="room-player-info">
                    <span className="room-player-name">
                      {p.name}
                      {p.id === room.createdBy && (
                        <span className="room-player-owner">
                          <Crown size={13} /> Dono
                        </span>
                      )}
                      {p.id === userId && " (você)"}
                    </span>
                    <span className="room-player-status">
                      {p.connected ? "Online" : "Offline"}
                    </span>
                  </div>
                  {isCreator && p.id !== room.createdBy && (
                    <button
                      className="room-player-remove"
                      title={`Remover ${p.name}`}
                      aria-label={`Remover ${p.name}`}
                      onClick={() => removePlayer(p.id, p.name)}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {!isCreator && (
              <p className="room-settings-note">
                Apenas o criador da sala pode remover jogadores.
              </p>
            )}
          </div>
        )}

        {tab === "customize" && (
          <div className="room-settings-panel">
            <div className="room-settings-field">
              <span className="room-settings-label">Cor de fundo do site</span>
              <div className="room-color-grid">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    className={`room-color-dot${room.color === c.id ? " selected" : ""}`}
                    style={{ background: c.css }}
                    title={c.label}
                    aria-label={c.label}
                    disabled={!isCreator}
                    onClick={() => updateSettings({ color: c.id })}
                  />
                ))}
              </div>
            </div>

            <div className="room-settings-field">
              <span className="room-settings-label">Tipo de mesa</span>
              <div className="room-table-grid">
                {TABLES.map((t) => (
                  <button
                    key={t.id}
                    className={`room-table-option${room.table === t.id ? " selected" : ""}`}
                    title={t.label}
                    disabled={!isCreator}
                    onClick={() => updateSettings({ table: t.id })}
                  >
                    <img src={t.img} alt={t.label} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {!isCreator && (
              <p className="room-settings-note">
                Apenas o criador da sala pode personalizar.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
