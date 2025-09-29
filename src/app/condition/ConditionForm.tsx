"use client";

import { useState, useEffect } from "react";
import { snomedConditions } from "@/data/snomedConditions";

interface ConditionFormProps {
  patientId: string;
  onSubmitData: (data: any) => void;
}

type ConditionItem = {
  clinicalStatus: string;
  category: string;
  severity: string;
  code: string;
  display: string;
  subject: { reference: string };
  onsetDateTime: string;
};

// ✅ 中英文對照表
const clinicalStatusOptions = [
  { value: "active", label: "active (活躍)" },
  { value: "recurrence", label: "recurrence (復發)" },
  { value: "relapse", label: "relapse (再發)" },
  { value: "inactive", label: "inactive (不活躍)" },
  { value: "remission", label: "remission (緩解)" },
  { value: "resolved", label: "resolved (已解決)" },
];

const categoryOptions = [
  { value: "problem-list-item", label: "problem-list-item (問題清單項目)" },
  { value: "encounter-diagnosis", label: "encounter-diagnosis (就診診斷)" },
];

const severityOptions = [
  { value: "24484000", label: "severe (嚴重)" },
  { value: "6736007", label: "moderate (中等)" },
  { value: "255604002", label: "mild (輕微)" },
];

export default function ConditionForm({ patientId, onSubmitData }: ConditionFormProps) {
  const [conditionList, setConditionList] = useState<ConditionItem[]>([
    {
      clinicalStatus: "",
      category: "",
      severity: "",
      code: "",
      display: "",
      subject: { reference: `Patient/${patientId}` },
      onsetDateTime: "",
    },
  ]);

  // ✅ 載入 localStorage
  useEffect(() => {
    const saved = localStorage.getItem("conditionList");
    if (saved) setConditionList(JSON.parse(saved));
  }, []);

  // ✅ 更新時存到 localStorage
  useEffect(() => {
    localStorage.setItem("conditionList", JSON.stringify(conditionList));
  }, [conditionList]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const newList = [...conditionList];

    if (name === "subject.reference") {
      newList[index].subject = { reference: value };
    } else if (name === "code") {
      const selected = snomedConditions.find((c) => c.code === value);
      newList[index].code = value;
      newList[index].display = selected ? selected.display : "";
    } else {
      (newList[index] as any)[name] = value;
    }

    setConditionList(newList);
  };

  const addCondition = () => {
    setConditionList([
      ...conditionList,
      {
        clinicalStatus: "",
        category: "",
        severity: "",
        code: "",
        display: "",
        subject: { reference: `Patient/${patientId}` },
        onsetDateTime: "",
      },
    ]);
  };

  const removeCondition = (index: number) => {
    setConditionList(conditionList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = conditionList.map((item) => {
      const selected = snomedConditions.find((c) => c.code === item.code);

      return {
        resourceType: "Condition",
        clinicalStatus: item.clinicalStatus
          ? { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: item.clinicalStatus }] }
          : undefined,
        category: item.category
          ? [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-category", code: item.category }] }]
          : undefined,
        severity: item.severity
          ? { coding: [{ system: "http://snomed.info/sct", code: item.severity }] }
          : undefined,
        code: selected
          ? {
              coding: [
                {
                  system: selected.system,
                  code: selected.code,
                  display: selected.display,
                },
              ],
              text: selected.display,
            }
          : undefined,
        subject: { reference: `Patient/${patientId}` },
        onsetDateTime: item.onsetDateTime || undefined,
      };
    });

    console.log("病況資料送出:", payload);
    onSubmitData(payload);
    alert("病況資料已送出");
  };

  return (
    <div className="max-w-3xl mx-auto my-6 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-bold text-center mb-6">病況表單</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {conditionList.map((item, index) => (
          <fieldset key={index} className="border p-4 rounded space-y-4">
            <legend className="font-semibold">
              {item.display ? `病況：${item.display}` : `病況紀錄 ${index + 1}`}
            </legend>

            <div className="grid grid-cols-2 gap-4">
              {/* 診斷代碼 - 獨佔一行 */}
              <label className="col-span-2">
                診斷代碼 *
                <select
                  name="code"
                  value={item.code}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="w-full"
                >
                  <option value="">請選擇 SNOMED CT</option>
                  {snomedConditions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.display} {c.text} ({c.code})
                    </option>
                  ))}
                </select>
              </label>

              {/* 臨床狀態 */}
              <label>
                臨床狀態
                <select name="clinicalStatus" value={item.clinicalStatus} onChange={(e) => handleChange(index, e)}>
                  <option value="">請選擇</option>
                  {clinicalStatusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* 類別 */}
              <label>
                類別
                <select name="category" value={item.category} onChange={(e) => handleChange(index, e)}>
                  <option value="">請選擇</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* 嚴重程度 */}
              <label>
                嚴重程度
                <select name="severity" value={item.severity} onChange={(e) => handleChange(index, e)}>
                  <option value="">請選擇</option>
                  {severityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* 發病時間 */}
              <label>
                發病時間
                <input
                  type="datetime-local"
                  name="onsetDateTime"
                  value={item.onsetDateTime}
                  onChange={(e) => handleChange(index, e)}
                />
              </label>

              {/* 患者 Reference - 獨佔一行 */}
              <label className="col-span-2">
                患者參照
                <input type="text" name="subject.reference" value={item.subject.reference} disabled className="w-full" />
              </label>
            </div>

            {conditionList.length > 1 && (
              <div className="col-span-2">
                <button
                  type="button"
                  className="bg-red-500 px-3 py-1 text-white rounded"
                  onClick={() => removeCondition(index)}
                >
                  刪除這筆
                </button>
              </div>
            )}
          </fieldset>
        ))}

        {/* 操作按鈕 */}
        <div className="flex gap-3 mt-4 justify-center">
          <button type="button" className="bg-green-500 px-4 py-2 text-white rounded" onClick={addCondition}>
            新增病況
          </button>
          <button type="submit" className="bg-blue-600 px-4 py-2 text-white rounded">
            送出病況資料
          </button>
        </div>
      </form>
    </div>
  );
}
