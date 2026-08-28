import React from "react";
import { Link, useParams } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import ObrazCard from "../components/ObrazCard.jsx";
import PageStub from "../components/PageStub.jsx";
import { decodeImageId, themeById, arcanaName } from "../lib/images.js";
import { useIsPhone, TAP } from "../theme/responsive.js";

/**
 * ЧУЖОЙ ОБРАЗ — /obraz/{id}
 * =========================
 * Точка входа новых людей. Человек получил картинку в мессенджере,
 * открыл ссылку — и здесь ему нечего делать, кроме как посчитать свою
 * матрицу. Поэтому на странице ровно одно действие и никакого меню
 * вариантов.
 *
 * Страница обязана работать у того, кто у нас никогда не был, поэтому
 * содержимое образа лежит в самом адресе (lib/images.js, encodeImageId),
 * а не в нашей базе. Когда появится бэкенд, id станет коротким кодом,
 * а читать его будет та же decodeImageId.
 */
export default function ObrazShare() {
  const { id } = useParams();
  const isPhone = useIsPhone();
  const image = decodeImageId(id);
  const theme = image ? themeById(image.themeId) : null;

  if (!image || !theme) {
    return (
      <PageStub
        badge="Образ не найден"
        title="Такой ссылки у нас нет"
        text="Похоже, ссылка обрезалась при пересылке. Попросите отправить её ещё раз — или посчитайте свою матрицу, это бесплатно."
      />
    );
  }

  return (
    <div style={S.cabinet}>
      <div style={{ ...S.obrazDone, justifyContent: "center", paddingTop: 20 }}>
        <ObrazCard arcana={image.arcana} accent={theme.accent} theme={theme.name}
          who={image.who} date={image.date} width={isPhone ? 280 : 320} />

        <div style={{ flex: "1 1 320px", minWidth: 0, maxWidth: 460 }}>
          <div style={S.eyebrow}>{theme.name}</div>
          <h1 style={{ ...S.cabH1, marginBottom: 12 }}>
            Это образ по <em style={S.h1em}>матрице судьбы</em>
          </h1>
          <p style={{ ...S.infoText, marginTop: 0 }}>
            Аркан {image.arcana} — {arcanaName(image.arcana)}. Он посчитан по дате
            рождения: арифметика, а не гадание. У каждой даты числа свои,
            и картинка тоже своя.
          </p>
          <p style={{ ...S.infoText }}>
            {theme.about}
          </p>

          <Link to="/matrica" className="btnGold" style={{
            ...S.cta, background: C.gold, color: C.ink, minHeight: TAP, marginTop: 8,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: isPhone ? "100%" : "auto", padding: "15px 30px",
          }}>
            Рассчитать свою матрицу
          </Link>
          <p style={{ ...S.dimSm, marginTop: 12 }}>
            Бесплатно и без регистрации. Ядро матрицы открывается сразу,
            свой образ можно собрать в разделе «AI-образы».
          </p>
        </div>
      </div>
    </div>
  );
}
