using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Student_Housing_Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddSomeDataToDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UniversityHousings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UniversityId = table.Column<int>(type: "int", nullable: false),
                    HousingId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UniversityHousings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UniversityHousings_Housings_HousingId",
                        column: x => x.HousingId,
                        principalTable: "Housings",
                        principalColumn: "HousingId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UniversityHousings_Universities_UniversityId",
                        column: x => x.UniversityId,
                        principalTable: "Universities",
                        principalColumn: "UniversityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UniversityHousings_HousingId",
                table: "UniversityHousings",
                column: "HousingId");

            migrationBuilder.CreateIndex(
                name: "IX_UniversityHousings_UniversityId_HousingId",
                table: "UniversityHousings",
                columns: new[] { "UniversityId", "HousingId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UniversityHousings");
        }
    }
}
