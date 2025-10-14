"use client";

import { useState } from "react";
import PatientForm from "@/app/patient/PatientForm";
import AllergyForm from "@/app/allergy/AllergyForm";
import ConditionForm from "@/app/condition/ConditionForm";
import ImmunizationForm from "@/app/immunization/ImmunizationForm"; 
import VitalSignsForm from "@/app/vitalsigns/VitalSignsForm"; 

// 共用 Tab 按鈕元件
function Tabs({
  activeTab,
  setActiveTab,
  tabs,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { key: string; label: string }[];
}) {
  return (
    <div className="tab-buttons">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function MainPage() {
  const [activeTab, setActiveTab] = useState("patient");

  // 收集子表單資料
  const [patientData, setPatientData] = useState<any>(null);
  const [allergyData, setAllergyData] = useState<any>(null);
  const [conditionData, setConditionData] = useState<any>(null);
  const [immunizationData, setImmunizationData] = useState<any>(null);
  const [vitalSignsData, setVitalSignsData] = useState<any>(null);




  const handlePatientSubmit = (data: any) => {
    console.log("父層收到病患資料:", data);
    setPatientData(data);
  };

  const handleAllergySubmit = (data: any) => {
    console.log("父層收到過敏原資料:", data);
    setAllergyData(data);
  };

  const handleConditionSubmit = (data: any) => {
    console.log("父層收到病情資料:", data);
    setConditionData(data);
  };
  const handleImmunizationSubmit = (data: any) => setImmunizationData(data);

  const handleVitalSignsSubmit = (data: any) => {
  console.log("父層收到生命體徵資料:", data);
  setVitalSignsData(data);
};
  const handleExport = () => {
    const allData = {
      patient: patientData,
      allergy: allergyData,
      condition: conditionData,
      immunization: immunizationData,
      vitalsigns: vitalSignsData,
    };

    console.log("全部資料：", allData);

    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fhir-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Tab 設定
  const tabs = [
    { key: "patient", label: "病患資料" },
    { key: "allergy", label: "過敏原" },
    { key: "condition", label: "病況資料" },
    { key: "immunization", label: "施打疫苗" },
    { key: "vitalsigns", label: "生命體徵" },
  ];

  return (
    <main className="container">
      <h1>FHIR Resource 表單</h1>

      {/* Tab Buttons */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "patient" && (
          <PatientForm onSubmitData={handlePatientSubmit} />
        )}
        {activeTab === "allergy" && (
          <AllergyForm
            patientId="example-patient-id"
            onSubmitData={handleAllergySubmit}
          />
        )}
        {activeTab === "condition" && (
          <ConditionForm
            patientId="example-patient-id"
            onSubmitData={handleConditionSubmit}
          />
        )}
        {activeTab === "immunization" && (
          <ImmunizationForm 
          patientId="example-patient-id" 
          onSubmitData={handleImmunizationSubmit} 
          />
        )}
        {activeTab === "vitalsigns" && (
          <VitalSignsForm
            patientId="example-patient-id"
            onSubmitData={handleVitalSignsSubmit}
            />
        )}

      </div>

      {/* 完成按鈕 */}
      <div className="mt-8">
        <button className="bg-green-500" onClick={handleExport}>
          完成輸入，輸出.json
        </button>
      </div>
    </main>
  );
}
