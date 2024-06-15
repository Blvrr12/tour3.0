import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Text "mo:base/Text";


actor {
    // Definición de tipos
    type Category = {
        id: Text;
        name: Text;
    };

    type Tour = {
        id: Text;
        name: Text;
        description: Text;
        category: Text;
        availableSpots: Nat;
    };
  

    type GetTourError = {
        #tourNotFound;
    };

    type GetTourResponse = Result.Result<Tour, GetTourError>;

    type Profile = {
        username: Text;
        bio: Text;
    };

    type GetProfileError = {
        #userNotAuthenticated;
        #profileNotFound;
    };

    type GetProfileResponse = Result.Result<Profile, GetProfileError>;

    type CreateProfileError = {
        #profileAlreadyExists;
        #userNotAuthenticated;
    };

    type CreateProfileResponse = Result.Result<Bool, CreateProfileError>;

    type PaymentError = {
        #invalidCardNumber;
        #paymentFailed;
    };
    

    type PaymentResponse = Result.Result<Bool, PaymentError>;

    let categories = HashMap.HashMap<Text, Category>(0, Text.equal, Text.hash);
    let tours = HashMap.HashMap<Text, Tour>(0, Text.equal, Text.hash);
    let profiles = HashMap.HashMap<Principal, Profile>(0, Principal.equal, Principal.hash);
    //let processPayment= HashMap.HashMap<Text,processPayment>(0,Text.equal);

    // Inicialización de categorías
    public func init() {
        categories.put("playas", { id = "playas"; name = "Playas" });
        categories.put("sierra", { id = "sierra"; name = "Sierra" });
        categories.put("bosque", { id = "bosque"; name = "Bosque" });
        categories.put("pueblos", { id = "pueblos"; name = "Pueblos" });
        categories.put("gastronomia", { id = "gastronomia"; name = "Gastronomía" });
        categories.put("rutas", { id = "rutas"; name = "Rutas/Caminatas" });
    };

    // Función para la sección Inicio
    public query func getHomePageContent() : async [Tour] {
        var homePageTours: [Tour] = [];
        for ((_, tour) in tours.entries()) {
            homePageTours := Array.append(homePageTours, [tour]);
        };
        return homePageTours;
    };

    // Función para la sección Buscar - Obtener tours por categoría
    public query func getToursByCategory(categoryId: Text) : async [Tour] {
        var result: [Tour] = [];
        for ((_, tour) in tours.entries()) {
            if (tour.category == categoryId) {
                result := Array.append(result, [tour]);
            }
        };
        return result;
    };
 

    // Función para la sección Buscar - Buscar tours por texto
    public query func getTours() : async [Tour] {
        var result: [Tour] = [];
        for ((_, tour) in tours.entries()) {
            result := Array.append(result, [tour]);
        }; 
        return result;
    };

    // Función para la sección Recomendaciones
    public query func getRecommendations() : async [Tour] {
        var recommendedTours: [Tour] = [];
        for ((_, tour) in tours.entries()) {
            if (tour.availableSpots < 10) {  // Ejemplo: recomendar tours con menos de 10 plazas disponibles
                recommendedTours := Array.append(recommendedTours, [tour]);
            }
        };
        return recommendedTours;
    };

    // Función para la sección Sobre Nosotros
    public query func getAboutUsContent() : async Text {
        return "Somos una empresa dedicada a ofrecer los mejores tours en diversas categorías.";
    };

    // Función para obtener el perfil del usuario
    public query ({caller}) func getProfile() : async GetProfileResponse {
        if (Principal.isAnonymous(caller)) return #err(#userNotAuthenticated);

        let profile = profiles.get(caller);
        switch profile {
            case (?profile) { return #ok(profile); };
            case null { return #err(#profileNotFound); };
        }
    };

    // Función para crear un perfil de usuario
    public shared ({caller}) func createProfile(username: Text, bio: Text) : async CreateProfileResponse {
        if (Principal.isAnonymous(caller)) return #err(#userNotAuthenticated);

        let profile = profiles.get(caller);
        if (profile != null) return #err(#profileAlreadyExists);

        let newProfile: Profile = {
            username = username;
            bio = bio;
        };
        profiles.put(caller, newProfile);
        return #ok(true);
    };

    // Función para procesar pagos
    public func processPayment(cardNumber: Text, amount: Nat) : async PaymentResponse {
        // Validar el número de tarjeta
        if (cardNumber.size() < 16 or cardNumber.size() > 19) {
            return #err(#invalidCardNumber);
        };
        
        // falta la lógica para procesar el pago
        // asumimos que el pago siempre se procesa correctamente
        // y se devuelve una respuesta exitosa
        // buscar a una API de procesamiento de pagos

        // Ejemplo de procesamiento fallido***
        let paymentSuccessful = true;

        if (paymentSuccessful) {
            return #ok(true);
        } else {
            return #err(#paymentFailed);
        }
    };

    // inicia categorías al iniciar el actor
    
}
