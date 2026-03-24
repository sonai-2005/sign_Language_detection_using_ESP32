import { useContext } from "react";
import { LanguageContext } from "../Context/LanguageContext";
import languages from "../language";
import Edit from "../fingerValue/edit";

export default function Settings() {
  const { lang, changeLanguage } = useContext(LanguageContext);
  const t = languages[lang];

  return (
    <div>
      <h2>{t.settings}</h2>

      <label>{t.selectLanguage}</label>
      <select value={lang} onChange={(e) => changeLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="bn">Bengali</option>
      </select>
      <Edit/>
    </div>
  );
}