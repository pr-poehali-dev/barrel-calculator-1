import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface Calculation {
  id: string;
  height: number;
  volume: number;
  percentage: number;
  timestamp: Date;
}

const BarrelCalculator = () => {
  const [height, setHeight] = useState<string>("");
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [currentResult, setCurrentResult] = useState<{
    volume: number;
    percentage: number;
  } | null>(null);

  // Load calculations from localStorage on component mount
  useEffect(() => {
    const savedCalculations = localStorage.getItem("barrelCalculations");
    if (savedCalculations) {
      const parsed = JSON.parse(savedCalculations);
      setCalculations(
        parsed.map((calc: any) => ({
          ...calc,
          timestamp: new Date(calc.timestamp),
        })),
      );
    }
  }, []);

  // Save calculations to localStorage whenever calculations change
  useEffect(() => {
    if (calculations.length > 0) {
      localStorage.setItem("barrelCalculations", JSON.stringify(calculations));
    }
  }, [calculations]);

  const calculateVolume = () => {
    const heightValue = parseFloat(height);
    if (isNaN(heightValue) || heightValue < 0 || heightValue > 87) {
      alert("Введите корректную высоту от 0 до 87 см");
      return;
    }

    // Standard 208L barrel dimensions: height 87cm, diameter 58cm
    const barrelHeight = 87; // cm
    const totalVolume = 208; // liters

    const volume = (heightValue / barrelHeight) * totalVolume;
    const percentage = (heightValue / barrelHeight) * 100;

    const result = {
      volume: Math.round(volume * 100) / 100,
      percentage: Math.round(percentage * 100) / 100,
    };

    setCurrentResult(result);

    // Add to history
    const newCalculation: Calculation = {
      id: Date.now().toString(),
      height: heightValue,
      volume: result.volume,
      percentage: result.percentage,
      timestamp: new Date(),
    };

    setCalculations((prev) => [newCalculation, ...prev]);
  };

  const clearHistory = () => {
    setCalculations([]);
    localStorage.removeItem("barrelCalculations");
  };

  const exportToCSV = () => {
    if (calculations.length === 0) return;

    const headers = ["Дата", "Высота (см)", "Объём (л)", "Заполнение (%)"];
    const csvContent = [
      headers.join(","),
      ...calculations.map((calc) =>
        [
          calc.timestamp.toLocaleString("ru-RU"),
          calc.height,
          calc.volume,
          calc.percentage,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `barrel_calculations_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    if (calculations.length === 0) return;

    const jsonContent = JSON.stringify(calculations, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `barrel_calculations_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="border border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
            <Icon name="Calculator" size={28} className="text-purple-600" />
            Калькулятор объёма бочки 208L
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Рассчитайте объём жидкости в стандартной 208-литровой бочке по
            высоте уровня
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="height"
                  className="text-sm font-medium text-gray-700"
                >
                  Высота жидкости (см)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="0-87 см"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1"
                  min="0"
                  max="87"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Максимальная высота бочки: 87 см
                </p>
              </div>
              <Button
                onClick={calculateVolume}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!height}
              >
                <Icon name="Play" size={16} className="mr-2" />
                Рассчитать объём
              </Button>
            </div>

            {currentResult && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Icon name="BarChart3" size={20} />
                  Результат расчёта
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Объём жидкости:
                    </span>
                    <span className="font-bold text-lg text-purple-700">
                      {currentResult.volume} л
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Заполнение:</span>
                    <span className="font-bold text-lg text-indigo-700">
                      {currentResult.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {calculations.length > 0 && (
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <Icon name="History" size={24} />
                История расчётов ({calculations.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Icon name="Download" size={16} className="mr-1" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToJSON}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Icon name="FileText" size={16} className="mr-1" />
                  JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={16} className="mr-1" />
                  Очистить
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Дата и время
                    </th>
                    <th className="text-right p-4 font-medium text-gray-700">
                      Высота (см)
                    </th>
                    <th className="text-right p-4 font-medium text-gray-700">
                      Объём (л)
                    </th>
                    <th className="text-right p-4 font-medium text-gray-700">
                      Заполнение (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.map((calc, index) => (
                    <tr
                      key={calc.id}
                      className={`border-b hover:bg-gray-50 ${index === 0 ? "bg-purple-50" : ""}`}
                    >
                      <td className="p-4 text-sm text-gray-600">
                        {calc.timestamp.toLocaleString("ru-RU")}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {calc.height}
                      </td>
                      <td className="p-4 text-right font-medium text-purple-700">
                        {calc.volume}
                      </td>
                      <td className="p-4 text-right font-medium text-indigo-700">
                        {calc.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarrelCalculator;
