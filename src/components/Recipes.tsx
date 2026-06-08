import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Clock, 
  Flame, 
  ArrowRight, 
  Dumbbell, 
  ChefHat, 
  Search,
  Sparkles,
  Utensils,
  Globe,
  X,
  PlusCircle,
  Check
} from 'lucide-react';
import { playClick, playTransition, playSuccess, playError } from '../lib/sounds';
import { cn } from '../lib/utils';

interface Recipe {
  id: string;
  title: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  type: string;
  source: string;
  ingredients: string[];
  ingredientsList: string[];
  description: string;
  img: string;
  steps: string[];
  allergens: string[];
}

interface RecipesProps {
  userProfile?: {
    nombre: string;
    alergias: string[];
  } | null;
  onAddRecipeToLog?: (recipeName: string, calories: number, protein: number, carbs: number, fats: number, mealType: string) => Promise<void>;
}

const ALLERGY_LABELS: Record<string, string> = {
  dairy: 'Lácteos',
  gluten: 'Gluten',
  peanuts: 'Maní',
  nuts: 'Frutos Secos',
  shellfish: 'Mariscos',
  soy: 'Soja',
  eggs: 'Huevos',
};

export default function Recipes({ userProfile, onAddRecipeToLog }: RecipesProps) {
  const [ingredients, setIngredients] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  
  // Meal logging state
  const [showMealModal, setShowMealModal] = useState(false);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const mockRecipes: Recipe[] = [
    {
      id: 'reg-1',
      title: 'Polenta Cremosa con Tuco',
      time: '25 min',
      calories: '450 kcal',
      protein: '12g',
      carbs: '60g',
      fats: '15g',
      type: 'Regional Argentino',
      source: 'Puli Cocina',
      ingredients: ['polenta', 'tomate', 'carne', 'tuco', 'queso'],
      ingredientsList: ['1 taza de polenta rápida', '3 tazas de caldo de verduras o leche', '1/2 taza de queso rallado', '250g de carne picada', '1 lata de puré de tomate', '1 cebolla pequeña', '1 diente de ajo', 'Sal, pimienta y orégano al gusto'],
      description: 'Un clásico reconfortante de la cocina argentina. Ideal para días frescos, servido con tuco de tomate y carne picada, coronado con queso rallado.',
      img: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&auto=format&fit=crop&q=80',
      steps: [
        'Picar la cebolla y el ajo, y saltearlos en una sartén con un chorrito de aceite.',
        'Agregar la carne picada y cocinar hasta que cambie de color. Incorporar el puré de tomate, condimentar y cocinar a fuego lento por 15 minutos.',
        'En una olla, calentar el caldo o leche. Cuando hierva, agregar la polenta en forma de lluvia revolviendo constantemente.',
        'Cocinar por 1 minuto (si es rápida) o hasta esceptar. Apagar el fuego y mezclar con el queso rallado y una pizca de manteca.',
        'Servir la polenta caliente en platos hondos y cubrir con abundante salsa de tuco.'
      ],
      allergens: ['dairy']
    },
    {
      id: 'reg-2',
      title: 'Ensalada Rápida de Atún y Arroz',
      time: '10 min',
      calories: '380 kcal',
      protein: '22g',
      carbs: '45g',
      fats: '10g',
      type: 'Económico',
      source: 'Cookpad AR',
      ingredients: ['atun', 'arroz', 'zanahoria', 'huevo', 'mayonesa'],
      ingredientsList: ['1 lata de atún al natural', '1 taza de arroz hervido (frío)', '1 zanahoria mediana rallada', '2 huevos duros picados', '2 cucharadas de mayonesa', 'Sal y limón al gusto'],
      description: 'Una opción fresca, proteica y súper accesible para el almuerzo. Usa zanahoria rallada para mayor textura y color.',
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      steps: [
        'Hervir el arroz en abundante agua con sal, colar y dejar enfriar.',
        'Rallar la zanahoria fina y picar los huevos duros.',
        'En un bol grande, mezclar el arroz frío con la zanahoria rallada, el huevo picado y el atún desmenuzado.',
        'Agregar la mayonesa y condimentar con sal y unas gotas de jugo de limón.',
        'Mezclar suavemente y servir frío. Se puede decorar con aceitunas.'
      ],
      allergens: ['eggs']
    },
    {
      id: 'reg-3',
      title: 'Tarta de Atún Económica',
      time: '35 min',
      calories: '420 kcal',
      protein: '20g',
      carbs: '38g',
      fats: '18g',
      type: 'Económico',
      source: 'Cookpad AR',
      ingredients: ['atun', 'cebolla', 'huevo', 'masa', 'tarta', 'morron'],
      ingredientsList: ['2 latas de atún al natural', '2 cebollas grandes picadas', '1/2 morrón rojo picado', '2 huevos duros picados', '1 disco de masa para tarta', 'Sal, pimienta y orégano'],
      description: 'Una tarta clásica, sabrosa y muy económica. El relleno de atún salteado con cebollas y huevo duro en una masa crocante es infalible.',
      img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80',
      steps: [
        'Rehogar las cebollas y el morrón picados en una sartén con aceite hasta que estén tiernos.',
        'Retirar del fuego y mezclar con el atún escurrido y desmenuzado, y los huevos picados. Condimentar al gusto.',
        'Colocar la masa en una tartera aceitada, verter el relleno de atún y distribuir de forma pareja.',
        'Opcional: Hacer un repulgue o cubrir con otra tapa de masa si se desea tarta tapada.',
        'Llevar a horno precalentado a 180°C durante 20-25 minutos hasta que la masa esté dorada.',
        'Dejar entibiar antes de cortar y servir.'
      ],
      allergens: ['gluten', 'eggs']
    },
    {
      id: 'reg-4',
      title: 'Empanadas de Atún al Horno',
      time: '25 min',
      calories: '310 kcal',
      protein: '14g',
      carbs: '32g',
      fats: '12g',
      type: 'Regional Argentino',
      source: 'Puli Cocina',
      ingredients: ['atun', 'cebolla', 'morron', 'tapas', 'empanada', 'huevo'],
      ingredientsList: ['1 lata de atún al natural', '1 cebolla grande picada', '1/2 morrón verde picado', '1 huevo duro picado', '12 tapas de empanadas para horno', 'Sal, pimienta y comino'],
      description: 'Empanadas crujientes rellenas de un sofrito jugoso de atún, cebolla y morrón. Un clásico de vigilia y delicias rápidas en cualquier mesa argentina.',
      img: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
      steps: [
        'Preparar el sofrito salteando la cebolla y el morrón en una sartén.',
        'Apagar el fuego, sumar el atún bien escurrido y mezclar. Agregar el huevo picado y condimentar.',
        'Dejar enfriar el relleno para que las empanadas no se abran al armarlas.',
        'Rellenar las tapas de empanadas, humedecer los bordes, cerrar y hacer el repulgue tradicional.',
        'Colocarlas en una placa engrasada y hornear a 200°C por 15 minutos o hasta que estén bien doraditas.'
      ],
      allergens: ['gluten', 'eggs']
    },
    {
      id: 'reg-5',
      title: 'Milanesas con Puré de Papas',
      time: '30 min',
      calories: '520 kcal',
      protein: '28g',
      carbs: '48g',
      fats: '22g',
      type: 'Regional Argentino',
      source: 'Puli Cocina',
      ingredients: ['carne', 'huevo', 'pan', 'papa', 'leche', 'milanesa'],
      ingredientsList: ['400g de carne para milanesas (bola de lomo o nalga)', '2 huevos batidos con ajo y perejil', '1 taza de pan rallado', '4 papas medianas', '50g de manteca', '1/2 taza de leche tibia', 'Sal y pimienta'],
      description: 'El plato preferido de los argentinos: milanesa de ternera crujiente acompañada de un puré de papas extra cremoso y mantecoso.',
      img: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&auto=format&fit=crop&q=80',
      steps: [
        'Pasar los bifes de carne por el huevo batido condimentado, y luego rebozarlos bien con el pan rallado presionando con los dedos.',
        'Hervir las papas peladas y cortadas en cubos en agua con sal hasta que estén tiernas.',
        'Cocinar las milanesas al horno en una placa aceitada a 200°C (10 min de cada lado) o freír en abundante aceite caliente.',
        'Pisar las papas calientes con la manteca, ir agregando la leche tibia poco a poco hasta lograr la consistencia cremosa deseada. Condimentar con sal.',
        'Servir la milanesa recién cocida con una buena porción de puré y unas rodajas de limón.'
      ],
      allergens: ['gluten', 'eggs', 'dairy']
    },
    {
      id: 'reg-6',
      title: 'Tortilla de Papas Económica',
      time: '25 min',
      calories: '340 kcal',
      protein: '12g',
      carbs: '30g',
      fats: '16g',
      type: 'Económico',
      source: 'Cookpad AR',
      ingredients: ['papa', 'huevo', 'cebolla', 'aceite'],
      ingredientsList: ['3 papas grandes', '1 cebolla picada', '4 huevos medianos', 'Aceite para freír', 'Sal al gusto'],
      description: 'Una tortilla jugosa y dorada, hecha con papas, cebolla y huevos. Simple, económica y extremadamente sabrosa.',
      img: 'https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?w=800&auto=format&fit=crop&q=80',
      steps: [
        'Pelar las papas y cortarlas en rodajas finas o pequeños cubos. Picar la cebolla.',
        'Freír las papas en abundante aceite a fuego medio para que se cocinen sin dorarse demasiado (confitar). A mitad de cocción sumar la cebolla.',
        'Retirar las papas y cebolla, escurrirlas muy bien para quitar el exceso de aceite.',
        'Batir los huevos en un bol grande con sal. Agregar las papas y cebollas calientes, mezclar y dejar reposar 5 minutos.',
        'Calentar una sartén antiadherente con una cucharadita de aceite. Verter la mezcla y cocinar a fuego medio.',
        'Cuando empiece a cuajar por los bordes, dar vuelta la tortilla con ayuda de un plato llano y cocinar 3-4 minutos más del otro lado.'
      ],
      allergens: ['eggs']
    },
    {
      id: 'reg-7',
      title: 'Fideos Express con Atún',
      time: '15 min',
      calories: '410 kcal',
      protein: '24g',
      carbs: '50g',
      fats: '11g',
      type: 'Express',
      source: 'Cookpad AR',
      ingredients: ['fideos', 'atun', 'tomate', 'queso', 'ajo'],
      ingredientsList: ['200g de fideos secos (tallarines o tirabuzones)', '1 lata de atún al natural', '1 lata de tomates cubeteados o salsa de tomate', '1 diente de ajo picado', 'Queso rallado opcional', 'Sal, pimienta y aceite de oliva'],
      description: 'La solución perfecta para comer rico, sano y súper rápido. Pasta al dente salteada con atún desmenuzado en salsa de tomate y ajo.',
      img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      steps: [
        'Cocinar los fideos en una olla con abundante agua hirviendo y sal según el tiempo del paquete.',
        'Mientras tanto, calentar aceite de oliva en una sartén y dorar el ajo picado.',
        'Agregar el tomate cubeteado y cocinar 5 minutos. Incorporar el atún desmenuzado y mezclar.',
        'Colar los fideos al dente y volcarlos directamente en la sartén con la salsa.',
        'Saltear todo junto por 1 minuto para amalgamar sabores y servir de inmediato con queso rallado.'
      ],
      allergens: ['gluten', 'dairy']
    },
    {
      id: 'reg-8',
      title: 'Risotto de Polenta Express',
      time: '15 min',
      calories: '390 kcal',
      protein: '10g',
      carbs: '42g',
      fats: '16g',
      type: 'Express',
      source: 'Puli Cocina',
      ingredients: ['polenta', 'queso', 'crema', 'champiñones', 'manteca'],
      ingredientsList: ['1 taza de polenta rápida', '3 tazas de caldo de verduras caliente', '100g de champiñones fileteados', '1/2 taza de crema de leche o leche', '50g de queso parmesano rallado', '1 cucharada de manteca'],
      description: 'Una reinterpretación cremosa y elegante de la polenta rápida, cocida con caldo y terminada con queso parmesano, crema y champiñones salteados.',
      img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80',
      steps: [
        'En una sartén pequeña, saltear los champiñones fileteados en un poco de manteca o aceite hasta dorar.',
        'En una olla mediana, llevar el caldo de verduras a ebullición.',
        'Agregar la polenta en forma de lluvia revolviendo enérgicamente para evitar grumos.',
        'Bajar el fuego y cocinar por 1 minuto. Sumar la crema de leche, el queso parmesano rallado y la manteca.',
        'Mezclar muy bien hasta lograr una textura cremosa similar a un risotto.',
        'Servir caliente coronado con los champiñones salteados.'
      ],
      allergens: ['dairy']
    },
    {
      id: 'reg-9',
      title: 'Cappellettis Express con Estofado de Pollo',
      time: '1h 30m',
      calories: '550 kcal',
      protein: '30g',
      carbs: '65g',
      fats: '18g',
      type: 'Regional Argentino',
      source: 'Cookpad AR',
      ingredients: ['pollo', 'cebolla', 'morron', 'tomate', 'jamon', 'queso', 'tapas', 'nuez moscada', 'queso crema'],
      ingredientsList: [
        'Jamón y queso de barra a gusto',
        'Tapas de empanadas pequeñas o Tapas de copetin',
        'Nuez moscada',
        'Sal y aceite',
        'Pollo (preferencia muslitos)',
        'Puré de tomate',
        '2 Cebollas',
        '1 Morrón rojo',
        'Condimentos',
        '1 cucharada Queso crema'
      ],
      description: 'Nos gusta mucho el estofado de pollo en casa y estos cappellettis rápidos son una buena excusa para comerlo.',
      img: 'https://img-global.cpcdn.com/recipes/50d1fbdbc5d0bfdf/680x781f0.5_0.5_1.0q80/cappellettis-express-con-estofado-de-pollo-foto-principal.webp',
      steps: [
        'Estofado: sofreír cebolla con morrón picaditos, agregar el pollo y sellar un poco, luego agregar los condimentos y el puré de tomate, dejar cocinar mínimo 40 minutos.',
        'Cappellettis(relleno): Picar chiquito o procesar jamón y queso cantidad a gusto, agregar media cebolla picada chiquito rehogada, condimentada con orégano y nuez moscada, y una cucharada de queso crema.',
        'Armar con las tapas los cappellettis a gusto, hervir unos minutos servir el estofado por encima y queso rallado.'
      ],
      allergens: ['dairy', 'gluten']
    },
    {
      id: 'reg-10',
      title: 'Relleno de Pollo Multiuso',
      time: '1h',
      calories: '420 kcal',
      protein: '35g',
      carbs: '20g',
      fats: '22g',
      type: 'Regional Argentino',
      source: 'Cookpad AR',
      ingredients: ['pollo', 'tomate', 'crema', 'papa', 'aceitunas', 'huevo', 'pasas de uva'],
      ingredientsList: [
        '5 patas muslos sin piel',
        '2 latas de tomate perita o (tomates bien lavados y picados sin piel)',
        '1 pote chico de crema',
        '1 sobrecito puré de papas',
        '1 pack de aceitunas picadas',
        '4 huevos duros picados',
        '1 sobrecito pasas de uva',
        'Sal a gusto o caldo saborizante'
      ],
      description: 'Este relleno puede servir tanto para empanadas como para tarta... Ideal para untar tostadas o rellenar canelones.',
      img: 'https://img-global.cpcdn.com/recipes/6e67aa627318c817/300x426f0.5_0.5_1.0q80/relleno-de-pollo-multiuso-foto-principal.jpg',
      steps: [
        'Hervir las presas de pollo sin la piel hasta que estén tiernas en agua con sal y laurel, dejar entibiar y deshuesar. Agregar los tomates y mixar hasta que quede una pasta homogénea. Agregar el puré en copos y mezclar bien. Incorporar las aceitunas.',
        'Unir todos los ingredientes y si se quiere, agregar las pasas de uva. Por último, agregar una cucharita de bicarbonato, la crema de leche y mezclar bien.',
        'Dejar reposar un poco mientras hervir los huevos cuando ya están cocidos pelar y picar.',
        'Agregar al relleno mezclar bien y guardar en la heladera hasta el momento de usar.',
        'Este relleno solo tiene la sal o el saborizante que lleva el pollo al hervirlo no tiene otros condimentos más fuertes.'
      ],
      allergens: ['dairy', 'eggs']
    },
    {
      id: 'reg-11',
      title: 'Salteado de Pollo y Verduras al Wok',
      time: '30 min',
      calories: '350 kcal',
      protein: '40g',
      carbs: '15g',
      fats: '12g',
      type: 'Express',
      source: 'Cookpad AR',
      ingredients: ['pollo', 'pechuga', 'zucchini', 'zanahoria', 'cebolla', 'ajo', 'aceite de oliva'],
      ingredientsList: [
        '2 pechugas de pollo',
        '1 zucchini',
        '1 zanahoria',
        '1 cebolla',
        '2 dientes ajo',
        'Cantidad necesaria sal, pimienta negra, pimentón y orégano',
        'Chorrito aceite de oliva'
      ],
      description: 'Un salteado de pollo y verduras rápido, colorido y lleno de sabor. Perfecto para resolver un almuerzo o cena en pocos minutos.',
      img: 'https://img-global.cpcdn.com/recipes/5ceed4ba9819d9a2/1200x630cq80/photo.jpg',
      steps: [
        'Cortar las pechugas en tiras o cubos medianos y condimentar con sal, pimienta y pimentón.',
        'Cortar el zucchini, la zanahoria y la cebolla en tiras finas.',
        'Calentar bien el wok con un chorrito de aceite. Cocinar primero el pollo hasta dorarlo. Agregar el ajo y la cebolla. Luego incorporar la zanahoria y por último el zucchini para que quede apenas crocante. Condimentar con un poco más de pimienta, orégano y pimentón.',
        'Servir bien caliente.'
      ],
      allergens: []
    }
  ];

  // Normalization function to handle Spanish accents and casing
  const normalize = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const searchWords = normalize(ingredients).split(/[\s,]+/).filter(Boolean);

  // Filters logic
  const filteredRecipes = mockRecipes.filter(recipe => {
    // Filter by style
    if (selectedStyle && recipe.type !== selectedStyle) {
      if (selectedStyle === 'Express' && recipe.type !== 'Express') return false;
      if (selectedStyle === 'Económico' && recipe.type !== 'Económico') return false;
      if (selectedStyle === 'Regional Argentino' && recipe.type !== 'Regional Argentino') return false;
    }

    // Filter by source
    if (selectedSource && recipe.source !== selectedSource) {
      return false;
    }

    // Filter by search terms
    if (searchWords.length > 0) {
      const matchIngredients = recipe.ingredients.some(ri => 
        searchWords.some(word => normalize(ri).includes(word) || word.includes(normalize(ri)))
      );
      const matchTitle = normalize(recipe.title).includes(normalize(ingredients));
      const matchDesc = normalize(recipe.description).includes(normalize(ingredients));
      
      return matchIngredients || matchTitle || matchDesc;
    }

    return true;
  });

  const getUserAllergens = (recipe: Recipe) => {
    if (!userProfile || !userProfile.alergias || userProfile.alergias.length === 0) return [];
    return recipe.allergens.filter(allergen => userProfile.alergias.includes(allergen));
  };

  const handleGenerate = () => {
    if (filteredRecipes.length === 0) return;
    playClick();
    setIsGenerating(true);
    
    setTimeout(() => {
      playTransition();
      setIsGenerating(false);
      
      const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
      const chosen = filteredRecipes[randomIndex];
      setGeneratedRecipe(chosen);
      setShowSteps(false);
    }, 1200);
  };

  const selectedRecipeAllergens = generatedRecipe ? getUserAllergens(generatedRecipe) : [];

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 px-2 sm:px-0">
      <header className="max-w-4xl">
        <div className="flex items-center gap-2 sm:gap-3 text-primary mb-2">
          <ChefHat size={24} />
          <span className="font-black uppercase tracking-[0.2em] text-[10px] sm:text-sm">Chef Inteligente</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-on-surface tracking-tighter mb-4 sm:mb-6 leading-none">
          Generador de <span className="text-primary italic">Recetas</span>
        </h1>
        <p className="text-base sm:text-xl text-on-surface-variant leading-relaxed max-w-2xl">
          ¿Qué tienes en la heladera? Ingresa los ingredientes y te sugeriremos el mejor plato regional o económico.
        </p>
      </header>

      {/* Ingredient Input Section */}
      <section className="bg-surface-container-low p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] editorial-shadow border border-surface-container-high relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary" size={20} />
              <input 
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Ej: atún, arroz, zanahoria..."
                className="w-full bg-white rounded-2xl sm:rounded-3xl py-4 sm:py-6 pl-14 sm:pl-16 pr-6 text-sm sm:text-lg font-bold border-none shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || filteredRecipes.length === 0}
              className="px-8 sm:px-10 py-4 sm:py-6 signature-gradient text-white rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 shadow-xl cursor-pointer"
            >
              {isGenerating ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Sugerir Plato</span>
                </>
              )}
            </button>
          </div>

          {/* Styles Selector */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mr-2">Estilos:</span>
            {['Regional Argentino', 'Económico', 'Express'].map(style => {
              const isSelected = selectedStyle === style;
              return (
                <button 
                  key={style}
                  onClick={() => {
                    playClick();
                    setSelectedStyle(isSelected ? null : style);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border cursor-pointer",
                    isSelected 
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-primary border-primary/10 hover:bg-primary hover:text-white"
                  )}
                >
                  {style}
                </button>
              );
            })}
          </div>

          {/* Sources Selector */}
          <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-surface-container-high">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Fuentes:</span>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {['Cookpad AR', 'Puli Cocina'].map(source => {
                const isSelected = selectedSource === source;
                const url = source === 'Cookpad AR' ? 'https://cookpad.com/ar/' : 'https://www.pulicocina.com/';
                return (
                  <div key={source} className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        playClick();
                        setSelectedSource(isSelected ? null : source);
                      }}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer",
                        isSelected
                          ? "bg-secondary text-white border-secondary shadow-sm"
                          : "bg-white text-secondary border-secondary/10 hover:bg-secondary hover:text-white"
                      )}
                    >
                      <Globe size={12} /> {source}
                    </button>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant/40 hover:text-secondary p-1">
                      <ArrowRight size={12} className="-rotate-45" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Suggestion Detail Section */}
      <AnimatePresence mode="wait">
        {generatedRecipe && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start bg-surface-container-low/40 p-6 sm:p-8 rounded-[2.5rem] border border-surface-container-high"
          >
            <div className="lg:col-span-5 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden aspect-square sm:aspect-auto sm:h-[400px] lg:h-full editorial-shadow relative">
              <img 
                src={generatedRecipe.img} 
                alt={generatedRecipe.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setGeneratedRecipe(null)}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/40 transition-all cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {generatedRecipe.type}
                  </span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Globe size={10} /> {generatedRecipe.source}
                  </span>
                  <div className="flex items-center gap-1 text-on-surface-variant text-[10px] font-bold ml-2">
                    <Clock size={12} /> {generatedRecipe.time}
                  </div>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight">{generatedRecipe.title}</h2>
                
                {/* Allergen Warning */}
                {selectedRecipeAllergens.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedRecipeAllergens.map(allergen => (
                      <span key={allergen} className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        ⚠️ Alergia: Contiene {ALLERGY_LABELS[allergen] || allergen}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-base sm:text-xl text-on-surface-variant leading-relaxed">
                  {generatedRecipe.description}
                </p>
              </div>

              {!showSteps ? (
                <>
                  <div className="grid grid-cols-3 gap-3 sm:gap-6">
                    <div className="p-4 sm:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl border border-surface-container-high text-center">
                      <Flame className="mx-auto mb-2 text-primary" size={20} />
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Cals</p>
                      <p className="text-sm sm:text-xl font-black">{generatedRecipe.calories.split(' ')[0]}</p>
                    </div>
                    <div className="p-4 sm:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl border border-surface-container-high text-center">
                      <Dumbbell className="mx-auto mb-2 text-secondary" size={20} />
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Prot</p>
                      <p className="text-sm sm:text-xl font-black">{generatedRecipe.protein}</p>
                    </div>
                    <div className="p-4 sm:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl border border-surface-container-high text-center">
                      <Utensils className="mx-auto mb-2 text-on-surface-variant" size={20} />
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Chef</p>
                      <p className="text-sm sm:text-xl font-black text-secondary">Fácil</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button 
                      onClick={() => {
                        playClick();
                        setShowSteps(true);
                      }}
                      className="flex-1 bg-primary text-white py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg shadow-lg hover:opacity-90 transition-all cursor-pointer text-center"
                    >
                      Ver Paso a Paso
                    </button>
                    {onAddRecipeToLog && (
                      <button 
                        onClick={() => {
                          playClick();
                          setShowMealModal(true);
                        }}
                        className="flex-1 bg-secondary text-white py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PlusCircle size={20} />
                        <span>Agregar al Diario</span>
                      </button>
                    )}
                    <button className="w-full sm:w-16 h-14 sm:h-16 rounded-2xl border-2 border-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer">
                      <Heart size={24} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6 bg-white p-6 rounded-3xl border border-surface-container-high">
                  <div>
                    <h3 className="text-lg font-black text-primary mb-3 flex items-center gap-2">
                      <Utensils size={18} />
                      <span>Ingredientes Necesarios</span>
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {generatedRecipe.ingredientsList?.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <input 
                            type="checkbox" 
                            id={`ing-${i}`}
                            className="rounded border-surface-container-high text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                          />
                          <label htmlFor={`ing-${i}`} className="cursor-pointer select-none">{ing}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-surface-container-high">
                    <h3 className="text-lg font-black text-primary mb-3 flex items-center gap-2">
                      <ChefHat size={18} />
                      <span>Instrucciones de Preparación</span>
                    </h3>
                    <ol className="space-y-4">
                      {generatedRecipe.steps?.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-on-surface-variant leading-relaxed">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-surface-container-high">
                    <button 
                      onClick={() => {
                        playClick();
                        setShowSteps(false);
                      }}
                      className="flex-1 bg-surface-container-high text-on-surface py-4 rounded-2xl font-black text-base hover:bg-surface-container-highest transition-all cursor-pointer"
                    >
                      Volver a la vista general
                    </button>
                    {onAddRecipeToLog && (
                      <button 
                        onClick={() => {
                          playClick();
                          setShowMealModal(true);
                        }}
                        className="flex-1 bg-secondary text-white py-4 rounded-2xl font-black text-base shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PlusCircle size={18} />
                        <span>Agregar al Diario</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Featured Grid / Search Results */}
      <section className="space-y-8 sm:space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">
              {ingredients || selectedStyle || selectedSource ? 'Búsqueda' : 'Inspiración'}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tighter">
              {ingredients || selectedStyle || selectedSource 
                ? `Recetas encontradas (${filteredRecipes.length})` 
                : 'Descubrimientos'}
            </h2>
          </div>
          {(ingredients || selectedStyle || selectedSource) && (
            <button 
              onClick={() => {
                playClick();
                setIngredients('');
                setSelectedStyle(null);
                setSelectedSource(null);
                setGeneratedRecipe(null);
              }}
              className="text-primary text-xs sm:text-sm font-bold hover:underline cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="bg-surface-container-low border border-dashed border-surface-container-high rounded-[2rem] p-12 text-center">
            <ChefHat size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
            <p className="font-bold text-lg text-on-surface mb-2">No encontramos recetas con esos filtros</p>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto">
              Intenta buscando con palabras simples como "atún", "polenta", "cebolla" o limpia los filtros para ver todo el catálogo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredRecipes.map((recipe) => {
              const activeAllergens = getUserAllergens(recipe);
              return (
                <motion.div 
                  key={recipe.id} 
                  whileHover={{ y: -5 }} 
                  onClick={() => {
                    playClick();
                    setGeneratedRecipe(recipe);
                    setShowSteps(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={cn(
                    "bg-white rounded-[2rem] overflow-hidden shadow-sm editorial-shadow flex flex-col sm:flex-row h-full cursor-pointer border-2 transition-all",
                    generatedRecipe?.id === recipe.id ? "border-primary" : "border-transparent hover:border-primary/20"
                  )}
                >
                  <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden relative">
                    <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover" />
                    {activeAllergens.length > 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow">
                        ⚠️ Alergia
                      </span>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-2 py-1 rounded">
                          {recipe.type}
                        </span>
                        <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                          {recipe.source}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold leading-tight">{recipe.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2">{recipe.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/50 text-[10px] sm:text-xs font-bold text-on-surface-variant">
                      <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                      <span className="flex items-center gap-1 text-primary"><Flame size={12} /> {recipe.calories}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Meal Selection Modal */}
      <AnimatePresence>
        {showMealModal && generatedRecipe && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-on-surface/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] p-8 sm:p-10 editorial-shadow relative overflow-hidden text-center"
            >
              <button 
                onClick={() => {
                  playClick();
                  setShowMealModal(false);
                }} 
                className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              
              <ChefHat size={40} className="mx-auto text-primary mb-4 animate-bounce" />
              <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2">Agregar al Diario</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                ¿A qué comida del día querés agregar <strong className="text-on-surface">{generatedRecipe.title}</strong>?
              </p>

              {addSuccess ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-6 flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Check size={32} />
                  </div>
                  <p className="font-bold text-primary">¡Receta agregada con éxito!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'Desayuno', icon: '🌅', label: 'Desayuno' },
                    { id: 'Almuerzo', icon: '☀️', label: 'Almuerzo' },
                    { id: 'Merienda', icon: '☕', label: 'Merienda' },
                    { id: 'Cena', icon: '🌙', label: 'Cena' }
                  ].map(meal => (
                    <button
                      key={meal.id}
                      disabled={isAddingRecipe}
                      onClick={async () => {
                        if (!onAddRecipeToLog) return;
                        playClick();
                        setIsAddingRecipe(true);
                        try {
                          const caloriesVal = Number(generatedRecipe.calories.replace(/[^0-9]/g, ''));
                          const proteinVal = Number(generatedRecipe.protein.replace(/[^0-9]/g, ''));
                          const carbsVal = Number(generatedRecipe.carbs.replace(/[^0-9]/g, ''));
                          const fatsVal = Number(generatedRecipe.fats.replace(/[^0-9]/g, ''));
                          
                          await onAddRecipeToLog(
                            generatedRecipe.title,
                            caloriesVal,
                            proteinVal,
                            carbsVal,
                            fatsVal,
                            meal.id
                          );
                          playSuccess();
                          setAddSuccess(true);
                          setTimeout(() => {
                            setAddSuccess(false);
                            setShowMealModal(false);
                            setIsAddingRecipe(false);
                          }, 1500);
                        } catch (e) {
                          console.error(e);
                          playError();
                          setIsAddingRecipe(false);
                        }
                      }}
                      className="w-full flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl hover:bg-primary/5 hover:text-primary transition-all text-left font-bold border border-transparent hover:border-primary/10 cursor-pointer disabled:opacity-50"
                    >
                      <span className="text-xl">{meal.icon}</span>
                      <span>{meal.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
