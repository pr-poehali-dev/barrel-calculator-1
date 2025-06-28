import BarrelCalculator from "@/components/BarrelCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Калькулятор объёма бочки
          </h1>
          <p className="text-gray-600 text-lg">
            Профессиональный инструмент для расчёта объёма жидкости в 208L
            бочках
          </p>
        </div>
        <BarrelCalculator />
      </div>
    </div>
  );
};

export default Index;
