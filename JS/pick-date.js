const salidaPicker = flatpickr("#fechaSalida", {
  dateFormat: "d/m",
  minDate: "today",
  onChange: function(selectedDates) {
    if (selectedDates.length > 0) {
      regresoPicker.set("minDate", selectedDates[0]);
      const regresoSeleccionado = regresoPicker.selectedDates[0];
      if (regresoSeleccionado && regresoSeleccionado < selectedDates[0]) {
        regresoPicker.clear();
      }
    }
  }
});

const regresoPicker = flatpickr("#fechaRegreso", {
  dateFormat: "d/m",
  minDate: "today",
});