// Paste your input DTOs here (e.g., Api2UserCreate, Api2UserUpdate)
// public class Api2UserCreate { public string Email { get; set; } ... }
// public class Api2UserUpdate { public string FirstName { get; set; } ... }


    [SwaggerModelName("TagCreate")]
    public class Api2TagCreate
    {
        /// <summary>
        /// Tag name used for organizing and categorizing prospects; maximum 128 characters.
        /// </summary>
        [Required(AllowEmptyStrings = false, ErrorMessage = "Title is required")]
        [StringLength(128, ErrorMessage = "Title cannot exceed 128 characters")]
        public string Title { get; set; }

        /// <summary>
        /// Optional description explaining the purpose or criteria for this tag; maximum 1,000 characters.
        /// </summary>
        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; }
    }