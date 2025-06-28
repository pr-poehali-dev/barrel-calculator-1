import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const BarrelCalculator = () => {
  const [height, setHeight] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const calculate = () => {
    const heightValue = parseFloat(height);

    if (isNaN(heightValue) || heightValue < 0) {
      setResult("Пожалуйста, введите корректное значение высоты");
      setIsError(true);
      setShowResult(true);
      return;
    }

    // Параметры бочки
    const radius = 28.5; // радиус в см
    const maxHeight = 82; // максимальная высота в см

    // Рассчитываем объем
    const volumeCm3 = Math.PI * Math.pow(radius, 2) * heightValue;
    const liters = Math.round((volumeCm3 / 1000) * 10) / 10;

    // Формируем результат
    if (heightValue > maxHeight) {
      setResult(
        `Высота ${heightValue} см превышает максимальную (82 см)\nМаксимальный объем: 208 литров`,
      );
      setIsError(true);
    } else {
      setResult(
        `При высоте ${heightValue} см\nОбъем жидкости: ${liters} литров`,
      );
      setIsError(false);
    }
    setShowResult(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculate();
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff] flex items-center justify-center p-5">
      <Card className="bg-white rounded-[10px] shadow-[0_0_20px_rgba(0,0,0,0.1)] w-full max-w-[500px] border-0">
        <CardContent className="p-[30px]">
          <h1 className="text-[#2c3e50] text-center mb-[30px] text-2xl font-semibold">
            Калькулятор бочки 208л
          </h1>

          <div className="mb-5">
            <Label
              htmlFor="height"
              className="block mb-2 font-bold text-[#34495e]"
            >
              Высота жидкости (в см):
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="Например: 50"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 border-2 border-[#bdc3c7] rounded-[5px] text-base focus:border-[#3498db] focus:outline-none"
            />
          </div>

          <Button
            onClick={calculate}
            className="bg-[#3498db] hover:bg-[#2980b9] text-white border-0 p-3 w-full rounded-[5px] text-base font-bold transition-colors duration-300"
          >
            Рассчитать объём
          </Button>

          {showResult && (
            <div className="mt-[30px] p-5 bg-[#e8f4f8] rounded-[5px] text-center text-lg">
              <div
                className={
                  isError ? "text-[#e74c3c] font-bold" : "text-[#2c3e50]"
                }
              >
                {result.split("\n").map((line, index) => (
                  <div key={index} className={index === 1 ? "font-bold" : ""}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-[30px] text-sm text-[#7f8c8d] text-center">
            <p>Стандартная бочка: 208 литров, высота 82 см, диаметр 57 см</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarrelCalculator;
