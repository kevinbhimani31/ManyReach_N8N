// Paste your output DTOs here (e.g., Api2User)
// public class Api2User { public Guid UserId { get; set; } public string Email { get; set; } public string FirstName { get; set; } public string LastName { get; set; } }


    /// <summary>
    /// Tag object represents a result/response for tag resource. Tag is a label organizing and categorizing prospects
    /// for segmentation and filtering. Tag provides flexible categorization where each prospect can have multiple tags,
    /// enabling advanced targeting and prospect management across campaigns.
    /// </summary>
    [SwaggerModelName("Tag")]
    public class Api2Tag
    {
        /// <summary>
        /// Unique identifier for the tag.
        /// </summary>
        public int TagId { get; set; }

        /// <summary>
        /// Timestamp when the tag was created in the system.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Tag name used for organizing and categorizing prospects; maximum 128 characters.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Optional description explaining the purpose or criteria for this tag; maximum 1,000 characters.
        /// </summary>
        public string Description { get; set; }
    }